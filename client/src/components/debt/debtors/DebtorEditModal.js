import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../../wealth/accounts/AccountStatusesDropDown';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    isLoading: false,
    message: "",
    debtorName: "",
    debtorNotes: "",
    debtorStatus: "",
}

function DebtorEditModal(props) {
    const [formData, setFormData] = useState(initialState);
    const [debtor, setDebtor] = useState(null);

    const loadDebtor = (id) => DebtorRequest.getDebtor(id)
    .then(  debtor => {
        setDebtor(debtor);
        if(debtor) setFormData({
            ...formData,
            debtorName: debtor.Name,
            debtorNotes: debtor.Notes,
            debtorStatus: debtor.Status,
            message: ''
        });
    });

    useEffect(()=>{
        if(props.debtorId) loadDebtor(props.debtorId);
    },[props.debtorId])

    const handleClick = () => {
        // Validate Input
        if(!formData.debtorName) {
            setFormData({...formData, message: 'Invalid debtor name, should not be empty'});
            return;
        } else {
          setFormData({...formData, message: "", isLoading: true});
        }
        // update debtor
        DebtorRequest.updateDebtor(debtor.Id, 
          formData.debtorName, formData.debtorNotes,
          formData.debtorStatus)                     
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

    return (
        <ModalContainer title={debtor?"Edit Debtor ("+debtor.Id+")":"Edit Debtor"}  
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="primary" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Save'
          }
          </Button>
        }>
        {
          debtor && <form>
          <Form.Group controlId="debtorName">
              <Form.Label>Debtor Name</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorName" value={formData.debtorName} onChange={handleChange}/>
          </Form.Group>
          <Form.Group controlId="debtorCurrency">
              <Form.Label>Debtor Currency</Form.Label>
              <Form.Control as="select" name="debtorCurrency"
              value={debtor.Currency} readOnly>
                <CurrenciesDropDown />
              </Form.Control>
          </Form.Group>
          <Form.Group controlId="debtorNotes">
              <Form.Label>Debtor Notes</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorNotes" value={formData.debtorNotes} onChange={handleChange}/>
          </Form.Group>
          <Form.Group controlId="debtorStatus">
              <Form.Label>Debtor Status</Form.Label>
              <Form.Control as="select" name="debtorStatus" onChange={handleChange}
              value={formData.debtorStatus}>
              <AccountStatusesDropDown />
              </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default DebtorEditModal;