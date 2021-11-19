import React, {useState} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import CardsDropDown from '../CardsDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';

import CardTransRequest from '../../../axios/CardTransRequest';

const initialState = {
    isLoading: false,
    message: "",
    cardId: 0,
    cardCurrency: "",
    cardDecimalPlaces: "",
    transCurrency: "",
    decimalPlaces: 0,
    transAmount: 0,
    transDate: "",
    transDesc: "",
    billAmount: 0
}

function CardTransactionAddModal(props) {

    const [formData, setFormData] = useState(initialState);

    const handleClick = () => {
      // Validate Input
      if(!formData.cardId) {
        setFormData({...formData, message: 'Invalid card, you must select a card'});
        return;
      } else if(!formData.transCurrency) {
        setFormData({...formData, message: 'Invalid currency, you must select a currency'});
        return;
      } else if(!formData.transAmount) {
        setFormData({...formData, message: 'Invalid amount, should be greater than zero'});
        return;
      } else if(!formData.transDate) {
        setFormData({...formData, message: 'Invalid transaction date'});
        return;
      } else if(!formData.transDesc) {
        setFormData({...formData, message: 'Invalid description, should not be empty'});
        return;
      } else if(!formData.billAmount) {
        setFormData({...formData, message: 'Invalid bill amount, should be greater than zero'});
        return;
      } else if(formData.cardCurrency === formData.transCurrency &&
        formData.transAmount !== formData.billAmount) {
        setFormData({...formData, message: 'Invalid transaction amount against bill amount as they are in same currency'});
        return;
      } else {
        setFormData({
          ...formData,
          message: '',
          isLoading: true,
        });
      }
      // add new card transaction
      CardTransRequest.addCardTransaction(formData.cardId, formData.transCurrency,
        formData.transAmount, formData.transDate, formData.transDesc,
        formData.billAmount)
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

    const handleCardChange = (event) => {
        const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
        const currencyCode = event.target[event.target.selectedIndex].getAttribute('currencycode');
        setFormData({
          ...formData,
          cardId : event.target.value,
          cardDecimalPlaces: decimalPlaces,
          cardCurrency: currencyCode
        });
      }

    const handleCurrencyChange = (event) => {
        const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
        setFormData({
          ...formData,
          transCurrency : event.target.value,
          decimalPlaces
        });
    }

    const handleTransDateChange = (jsDate, date) => {
        setFormData({...formData, transDate:date});
    }

    return (
        <ModalContainer title="Add New Card Transaction" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="primary" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add'
          }
          </Button>
        }>
            <form>
            <Form.Group controlId="cardId">
              <Form.Label>Card</Form.Label>
              <Form.Control as="select" name="cardId" onChange={handleCardChange}
                value={formData.cardId}>
                <option value=''>Cards</option>
                <CardsDropDown cards={props.cards} status={"ACTIVE"}/>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transCurrency">
              <Form.Label>Transaction Currency</Form.Label>
              <Form.Control as="select" name="transCurrency" onChange={handleCurrencyChange}>
                <option value=''></option>
                <CurrenciesDropDown />
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transAmount">
              <Form.Label>Transaction Amount</Form.Label>
              <Form.Control type="number" maxLength={20}
              name="transAmount"
              value={Number(formData.transAmount).toFixed(formData.decimalPlaces)}
              onChange={handleChange}/>
            </Form.Group>
            <Form.Group controlId="transDate">
              <Form.Label>Transaction Date</Form.Label>
              <DatePickerInput value={formData.transDate}
              onChange={handleTransDateChange} readOnly/>
            </Form.Group>
            <Form.Group controlId="transDesc">
              <Form.Label>Transaction Description</Form.Label>
              <Form.Control type="input" maxLength={200}
                name="transDesc" value={formData.transDesc} onChange={handleChange}/>
            </Form.Group>
            <Form.Group controlId="billAmount">
              <Form.Label>Bill Amount</Form.Label>
              <InputGroup>
                <Form.Control type="number" maxLength={20}
                name="billAmount"
                value={Number(formData.billAmount).toFixed(formData.cardDecimalPlaces)}
                onChange={handleChange}/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">{formData.cardCurrency}</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </form>
        </ModalContainer>
    );
}

export default CardTransactionAddModal;