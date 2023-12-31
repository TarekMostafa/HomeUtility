import React, {useState} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    isLoading: false,
    message: "",
    debtorName: "",
    debtorCurrency: "",
    debtorNotes: "",
    decimalPlaces: 0,
}

function DebtorAddModal(props) {
    const [formData, setFormData] = useState(initialState);

    const handleClick = () => {
        // Validate Input
        if(!formData.debtorName) {
          setFormData({...formData, message: 'Invalid debtor name, should not be empty'});
          return;
        } else if(!formData.debtorCurrency) {
          setFormData({...formData, message: 'Invalid debtor currency, should not be empty'});
          return;
        } else {
          setFormData({
            ...formData,
            message: '',
            isLoading: true,
          });
        }

        DebtorRequest.addDebtor(formData.debtorName, formData.debtorCurrency, formData.debtorNotes)
        .then( () => {
            if (typeof props.onSave=== 'function') {
                props.onSave();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name] : event.target.value
        });
    }

    const handleCurrencyChange = (event) => {
        const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
        setFormData({
          ...formData,
          debtorCurrency : event.target.value,
          decimalPlaces
        });
    }

    return (
        <ModalContainer title="Add New Debtor" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="primary" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Create'
          }
          </Button>
        }>
          <form>
            <Form.Group controlId="debtorName">
              <Form.Label>Debtor Name</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorName" value={formData.debtorName} onChange={handleChange}/>
            </Form.Group>
            <Form.Group controlId="debtorCurrency">
              <Form.Label>Debtor Currency</Form.Label>
              <Form.Control as="select" name="debtorCurrency" onChange={handleCurrencyChange}>
                <option value=''></option>
                <CurrenciesDropDown />
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="debtorNotes">
              <Form.Label>Debtor Notes</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorNotes" value={formData.debtorNotes} onChange={handleChange}/>
            </Form.Group>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        </ModalContainer>
    );
}

export default DebtorAddModal;