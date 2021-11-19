import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import CardsDropDown from '../CardsDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';

import CardTransRequest from '../../../axios/CardTransRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function CardTransactionDeleteModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [cardTransaction, setCardTransaction] = useState(null);

    const loadCardTransaction = (id) => CardTransRequest.getCardTransaction(id)
        .then(cardTrans => setCardTransaction(cardTrans));

    useEffect(()=>{
        if(props.cardTransId) loadCardTransaction(props.cardTransId);
    },[props.cardTransId])

    const handleClick = () => {
      setFormData({...formData, message: "", isLoading: true});
      // delete card transaction
      CardTransRequest.deleteCardTransaction(cardTransaction.cardTransId)                   
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
        <ModalContainer title="Delete Card Transaction" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
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
          cardTransaction && 
          <form>
            <Form.Group controlId="cardId">
              <Form.Label>Card</Form.Label>
              <Form.Control as="select" name="cardId" readOnly
                value={cardTransaction.cardId}>
                <option value=''>Cards</option>
                <CardsDropDown cards={props.cards}/>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transCurrency">
              <Form.Label>Transaction Currency</Form.Label>
              <Form.Control as="select" name="transCurrency" readOnly
                value={cardTransaction.cardTransCurrency}>
                <option value=''></option>
                <CurrenciesDropDown />
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transAmount">
              <Form.Label>Transaction Amount</Form.Label>
              <Form.Control type="number" maxLength={20}
              name="transAmount"
              value={Number(cardTransaction.cardTransAmount)
                .toFixed(cardTransaction.currency.currencyDecimalPlace)}
                readOnly/>
            </Form.Group>
            <Form.Group controlId="transDate">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control type="input"
              name="transDate" 
              value={moment(cardTransaction.cardTransDate).format('DD/MM/YYYY')} 
              readOnly/>
            </Form.Group>
            <Form.Group controlId="transDesc">
              <Form.Label>Transaction Description</Form.Label>
              <Form.Control type="input" maxLength={200}
                name="transDesc" value={cardTransaction.cardTransDesc} readOnly/>
            </Form.Group>
            <Form.Group controlId="billAmount">
              <Form.Label>Bill Amount</Form.Label>
              <InputGroup>
                <Form.Control type="number" maxLength={20}
                name="billAmount"
                value={Number(cardTransaction.cardTransBillAmount)
                  .toFixed(cardTransaction.card.currency.currencyDecimalPlace)}
                  readOnly/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">
                    {cardTransaction.card.cardCurrency}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardTransactionDeleteModal;