import React, {useState, useEffect} from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import AccountStatusesDropDown from '../../wealth/accounts/AccountStatusesDropDown';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function DebtorViewModal(props){
    const [formData, setFormData] = useState(initialState);
    const [debtor, setDebtor] = useState(null);

    const loadDebtor = (id) => DebtorRequest.getDebtor(id)
        .then(  debtor => setDebtor(debtor));

    useEffect(()=>{
        if(props.debtorId) loadDebtor(props.debtorId);
    },[props.debtorId])

    return (
        <ModalContainer title={debtor?"View Debtor ("+debtor.Id+")":"View Debtor"} 
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}>
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
                <Form.Control type="number" maxLength={20}
                name="debtorBalance"
                value={Number(debtor.Balance)
                  .toFixed(debtor.CurrencyDecimalPlace)}
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

export default DebtorViewModal;