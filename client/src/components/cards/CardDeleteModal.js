import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../common/ModalContainer';
import BanksDropDown from '../wealth/banks/BanksDropDown';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../wealth/accounts/AccountStatusesDropDown';

import CardRequest from '../../axios/CardRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function CardDeleteModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [card, setCard] = useState(null);

    const loadCard = (id) => CardRequest.getCard(id)
        .then(  card => setCard(card));

    useEffect(()=>{
        if(props.cardId) loadCard(props.cardId);
    },[props.cardId])

    const handleClick = () => {
      setFormData({...formData, message: "", isLoading: true});
      // update card
      CardRequest.deleteCard(card.cardId)                   
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
        <ModalContainer title="Delete Card" show={props.show}
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
          card && <form>
          <Form.Group controlId="cardBank">
            <Form.Label>Card Bank</Form.Label>
            <Form.Control as="select" name="cardBank" 
            value={card.cardBank} readOnly>
              <BanksDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="input" maxLength={20}
            name="cardNumber" value={card.cardNumber} readOnly/>
          </Form.Group>
          <Form.Group controlId="cardCurrency">
            <Form.Label>Card Currency</Form.Label>
            <Form.Control as="select" name="cardCurrency" 
            value={card.cardCurrency} readOnly>
              <CurrenciesDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="cardLimit">
            <Form.Label>Card Limit</Form.Label>
            <Form.Control type="number" maxLength={20}
            name="cardLimit"
            value={Number(card.cardLimit).toFixed(card.currency.currencyDecimalPlace)}
            readOnly/>
          </Form.Group>
          <Form.Group controlId="cardStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="input"
            name="cardStartDate" value={moment(card.cardStartDate).format('DD/MM/YYYY')} readOnly/>
          </Form.Group>
          <Form.Group controlId="cardExpiryDate">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="input"
            name="cardExpiryDate" value={moment(card.cardExpiryDate).format('DD/MM/YYYY')} readOnly/>
          </Form.Group>
          <Form.Group controlId="cardStatus">
              <Form.Label>Card Status</Form.Label>
              <Form.Control as="select" name="cardStatus" readOnly
              value={card.cardStatus}>
              <AccountStatusesDropDown />
              </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardDeleteModal;