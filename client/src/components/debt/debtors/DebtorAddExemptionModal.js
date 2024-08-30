import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    isLoading: false,
    message: "",
    exemptionAmount: 0,
}

function DebtorAddExemptionModal(props){
    const [formData, setFormData] = useState(initialState);
    const [debtor, setDebtor] = useState(null);

    const loadDebtor = (id) => DebtorRequest.getDebtor(id)
        .then(  debtor => {
          setDebtor(debtor);
          setFormData({
            ...formData, 
            exemptionAmount: debtor.Balance
          });
        });

    useEffect(()=>{
        if(props.debtorId) loadDebtor(props.debtorId);
    },[props.debtorId])

    const handleClick = () => {
        setFormData({...formData, message: "", isLoading: true});
        // update debtor
        DebtorRequest.updateExemptionAmount(debtor.Id, formData.exemptionAmount)                   
        .then( () => {
            if (typeof props.onExempt=== 'function') {
                props.onExempt();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    return (
        <ModalContainer title={debtor?"Add Exemption ("+debtor.Id+")":"Add Exemption"} 
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="primary" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add'
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
            <Form.Group controlId="exemptionAmount">
                <Form.Label>Exemption Amount</Form.Label>
                <Form.Control type="number" maxLength={20}
                    name="exemptionAmount"
                    value={Number(formData.exemptionAmount).toFixed(debtor.CurrencyDecimalPlace)}
                    onChange={e=>setFormData({...formData, exemptionAmount:e.target.value})}/>
            </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default DebtorAddExemptionModal;