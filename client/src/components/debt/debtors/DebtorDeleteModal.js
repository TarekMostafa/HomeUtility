import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import AccountStatusesDropDown from '../../wealth/accounts/AccountStatusesDropDown';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function DebtorDeleteModal(props){
    const [formData, setFormData] = useState(initialState);
    const [debtor, setDebtor] = useState(null);

    const loadDebtor = (id) => DebtorRequest.getDebtor(id)
        .then(  debtor => setDebtor(debtor));

    useEffect(()=>{
        if(props.debtorId) loadDebtor(props.debtorId);
    },[props.debtorId])

    const handleClick = () => {
        setFormData({...formData, message: "", isLoading: true});
        // update debtor
        DebtorRequest.deleteDebtor(debtor.Id)                   
        .then( () => {
            if (typeof props.onDelete=== 'function') {
                props.onDelete();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    return (
        <ModalContainer title={debtor?"Delete Debtor ("+debtor.Id+")":"Delete Debtor"} 
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="danger" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Delete'
          }
          </Button>
        }>
        {
          debtor && <form>
            <Form.Group controlId="debtorName">
              <Form.Label>Debtor Name</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorName" value={debtor.Name} readOnly/>
          </Form.Group>
          <Form.Group controlId="debtorBalance">
              <Form.Label>Debtor Balance</Form.Label>
              <InputGroup>
                <Form.Control type="input" maxLength={20}
                name="debtorBalance"
                // value={Number(debtor.Balance)
                //   .toFixed(debtor.CurrencyDecimalPlace)}
                value={debtor.BalanceFormatted}
                  readOnly/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">
                    {debtor.Currency}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="debtorExemption">
              <Form.Label>Debtor Exemption</Form.Label>
              <InputGroup>
                <Form.Control type="input" maxLength={20}
                name="debtorExemption"
                value={debtor.ExemptionAmountFormatted}
                  readOnly/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">
                    {debtor.Currency}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
          <Form.Group controlId="debtorNotes">
              <Form.Label>Debtor Notes</Form.Label>
              <Form.Control type="input" maxLength={50}
              name="debtorNotes" value={debtor.Notes} readOnly/>
          </Form.Group>
          <Form.Group controlId="debtorStatus">
              <Form.Label>Debtor Status</Form.Label>
              <Form.Control as="select" name="debtorStatus"
              value={debtor.Status} readOnly>
              <AccountStatusesDropDown />
              </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default DebtorDeleteModal;