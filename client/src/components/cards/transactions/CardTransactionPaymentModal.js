import React, {useState, useEffect} from 'react';
import { Button, Spinner, Form, Row, Col } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import CardTransactionPaymentTable from './CardTransactionPaymentTable';
import CardTransactionPaymentAlert from './CardTransactionPaymentAlert';
import AccountsDropDown from '../../wealth/accounts/AccountsDropDown';
import TransactionTypesDropDown from '../../wealth/transactiontypes/TransactionTypesDropDown';

import CardRequest from '../../../axios/CardRequest';
import CardTransRequest from '../../../axios/CardTransRequest';

const initialState = {
    isLoading: false,
    message: "",
    accountId: "",
    transactionTypeId: "",
    postingDate: new Date(Date.now())
}

function CardTransactionPaymentModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [card, setCard] = useState(null);

    const handleChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name] : event.target.value,
        message: ""
      });
    }

    const loadCard = () => 
        CardRequest.getCard(props.cardId)
        .then(card => setCard(card));

    useEffect(()=>{
      loadCard();
    },[])

    const handleClick = () => {
      // Validate Input
      if(!formData.accountId) {
        setFormData({...formData, message: 'Invalid account, you must select an account'});
        return;
      } else if(!formData.transactionTypeId) {
        setFormData({...formData, message: 'Invalid transaction type, you must select one'});
        return;
      } else if(!formData.postingDate) {
        setFormData({...formData, message: 'Invalid posting date'});
        return;
      } else {
        setFormData({
          ...formData,
          message: '',
          isLoading: true,
        });
      }
      // pay card transaction
      CardTransRequest.payCardTransactions(props.cardTransactions.map( trns => trns.cardTransId), 
        formData.accountId, formData.transactionTypeId, formData.postingDate)
      .then( () => {
          if (typeof props.onPay=== 'function') props.onPay();
          setFormData({...formData, isLoading: false});
          props.onHide();
      })
      .catch( err => {
          if (typeof props.onPay=== 'function') props.onPay();
          setFormData({...formData, message: err.response.data, isLoading: false});
      })
    }

    const handlePostingDateChange = (jsDate, date) => {
      setFormData({...formData, postingDate:date});
    }

    return (
        <ModalContainer title="Card Transaction Payments" size="lg" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="success" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Pay'
          }
          </Button>
        }>
        {
          card && <React.Fragment>
            <CardTransactionPaymentAlert cardTransactions={props.cardTransactions} 
            card={card}/>
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group controlId="accountId">
                    <Form.Label>Account</Form.Label>
                    <Form.Control as="select" name="accountId" onChange={handleChange}
                      value={formData.accountId}>
                      <option value=''>Accounts</option>
                      <AccountsDropDown status="ACTIVE" bank={card.cardBank}/>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="transactionTypeId">
                    <Form.Label>Transaction Type</Form.Label>
                    <Form.Control as="select" name="transactionTypeId" onChange={handleChange}
                      value={formData.transactionTypeId}>
                      <option value=''>Transaction Types</option>
                      <TransactionTypesDropDown typeCRDR="Debit"/>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Form.Group controlId="postingDate">
                    <Form.Label>Posting Date</Form.Label>
                    <DatePickerInput value={formData.postingDate}
                    onChange={handlePostingDateChange} readOnly/>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </Form>
          </React.Fragment>
        }
          <CardTransactionPaymentTable cardTransactions={props.cardTransactions}/>
        </ModalContainer>
    )
}

export default CardTransactionPaymentModal;