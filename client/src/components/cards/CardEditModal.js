import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../common/ModalContainer';
import BanksDropDown from '../wealth/banks/BanksDropDown';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../wealth/accounts/AccountStatusesDropDown';

import CardRequest from '../../axios/CardRequest';

const initialState = {
    isLoading: false,
    message: "",
    cardLimit: 0,
    cardStartDate: "",
    cardExpiryDate: "",
    cardStatus: ""
}

function CardEditModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [card, setCard] = useState(null);

    const loadCard = (id) => CardRequest.getCard(id)
        .then(  card => {
            setCard(card);
            if(card) setFormData({
                ...formData,
                cardLimit: card.cardLimit,
                cardStartDate: card.cardStartDate,
                cardExpiryDate: card.cardExpiryDate,
                cardStatus: card.cardStatus
            });
        });

    useEffect(()=>{
        if(props.cardId) loadCard(props.cardId);
    },[props.cardId])

    const handleClick = () => {
      // Validate Input
      if(!formData.cardLimit || Number(formData.cardLimit) === 0) {
        setFormData({...formData, message: 'Invalid card limit, should be greater than zero'});
        return;
      } else if(!formData.cardStartDate) {
        setFormData({...formData, message: 'Invalid Start Date'});
        return;
      } else if(!formData.cardExpiryDate) {
        setFormData({...formData, message: 'Invalid Expiry Date'});
        return;
      } else if(formData.cardStartDate > formData.cardExpiryDate) {
        setFormData({...formData, message: 'Start Date should be before Expiry Date'});
        return;
      } else {
        setFormData({...formData, message: "", isLoading: true});
      }
      // update card
      CardRequest.updateCard(card.cardId, 
        formData.cardLimit, formData.cardStatus,
        formData.cardStartDate, formData.cardExpiryDate)                     
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

    const handleStartDateChange = (jsDate, date) => {
      setFormData({...formData, cardStartDate:date});
    }

    const handleExpiryDateChange = (jsDate, date) => {
      setFormData({...formData, cardExpiryDate:date});
    }

    return (
        <ModalContainer title="Edit Card" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
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
            value={Number(formData.cardLimit).toFixed(card.currency.currencyDecimalPlace)}
            onChange={handleChange}/>
          </Form.Group>
          <Form.Group controlId="cardStartDate">
            <Form.Label>Start Date</Form.Label>
            <DatePickerInput value={formData.cardStartDate}
            onChange={handleStartDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="cardExpiryDate">
            <Form.Label>Expiry Date</Form.Label>
            <DatePickerInput value={formData.cardExpiryDate}
            onChange={handleExpiryDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="cardStatus">
              <Form.Label>Card Status</Form.Label>
              <Form.Control as="select" name="cardStatus" onChange={handleChange}
              value={formData.cardStatus}>
              <AccountStatusesDropDown />
              </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardEditModal;