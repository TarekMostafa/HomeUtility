import React, {useState} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../common/ModalContainer';
import BanksDropDown from '../wealth/banks/BanksDropDown';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';

import CardRequest from '../../axios/CardRequest';

const initialState = {
    isLoading: false,
    message: "",
    cardBank: "",
    cardNumber: "",
    cardCurrency: "",
    decimalPlaces: 0,
    cardLimit: 0,
    cardStartDate: "",
    cardExpiryDate: ""
}

function CardAddModal(props) {

    const [formData, setFormData] = useState(initialState);

    const handleClick = () => {
      // Validate Input
      if(!formData.cardBank) {
        setFormData({...formData, message: 'Invalid card bank, should not be empty'});
        return;
      } else if(!formData.cardNumber) {
        setFormData({...formData, message: 'Invalid card number, should not be empty'});
        return;
      } else if(!formData.cardCurrency) {
        setFormData({...formData, message: 'Invalid card currency, should not be empty'});
        return;
      } else if(!formData.cardLimit) {
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
        setFormData({
          ...formData,
          message: '',
          isLoading: true,
        });
      }

      // Add new card
      CardRequest.addCard(formData.cardNumber, formData.cardLimit, formData.cardBank,
        formData.cardCurrency, formData.cardStartDate, formData.cardExpiryDate)
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
        cardCurrency : event.target.value,
        decimalPlaces
      });
    }

    const handleStartDateChange = (jsDate, date) => {
      setFormData({...formData, cardStartDate:date});
    }

    const handleExpiryDateChange = (jsDate, date) => {
      setFormData({...formData, cardExpiryDate:date});
    }

    return (
        <ModalContainer title="Add New Card" show={props.show}
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
            <Form.Group controlId="cardBank">
              <Form.Label>Card Bank</Form.Label>
              <Form.Control as="select" name="cardBank" onChange={handleChange}>
                <option value=''></option>
                <BanksDropDown />
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="input" maxLength={20}
              name="cardNumber" value={formData.cardNumber} onChange={handleChange}/>
            </Form.Group>
            <Form.Group controlId="cardCurrency">
              <Form.Label>Card Currency</Form.Label>
              <Form.Control as="select" name="cardCurrency" onChange={handleCurrencyChange}>
                <option value=''></option>
                <CurrenciesDropDown />
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="cardLimit">
              <Form.Label>Card Limit</Form.Label>
              <Form.Control type="number" maxLength={20}
              name="cardLimit"
              value={Number(formData.cardLimit).toFixed(formData.decimalPlaces)}
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
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        </ModalContainer>
    );
}

export default CardAddModal;