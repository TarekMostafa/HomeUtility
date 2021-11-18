import React, {useState} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import CardsDropDown from '../CardsDropDown';

import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    isLoading: false,
    message: "",
    cardId: 0,
    cardCurrency: "",
    decimalPlaces: 0,
    itemDesc: "",
    purchaseDate: "",
    price: 0,
    noOfInst: 0,
}

function CardInstallmentAddModal(props) {

    const [formData, setFormData] = useState(initialState);

    const handleClick = () => {
      // Validate Input
      if(!formData.cardId) {
        setFormData({...formData, message: 'Invalid card, you must select a card'});
        return;
      } else if(!formData.itemDesc) {
        setFormData({...formData, message: 'Invalid item description, should not be empty'});
        return;
      } else if(!formData.purchaseDate) {
        setFormData({...formData, message: 'Invalid purchase date'});
        return;
      } else if(!formData.price) {
        setFormData({...formData, message: 'Invalid price, should be greater than zero'});
        return;
      } else if(!formData.noOfInst) {
        setFormData({...formData, message: 'Invalid number of installment, should be greater than zero'});
        return;
      } else {
        setFormData({
          ...formData,
          message: '',
          isLoading: true,
        });
      }

      // Add new card
      CardInstRequest.addCardInstallment(formData.cardId, formData.itemDesc,
        formData.purchaseDate, formData.noOfInst, formData.price)
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
        decimalPlaces,
        cardCurrency: currencyCode
      });
    }

    const handlePurchaseDateChange = (jsDate, date) => {
      setFormData({...formData, purchaseDate:date});
    }

    return (
        <ModalContainer title="Add New Card Installment" show={props.show}
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
            <Form.Group controlId="cardId">
              <Form.Label>Card</Form.Label>
              <Form.Control as="select" name="cardId" onChange={handleCardChange}
                value={formData.cardId}>
                <option value=''>Cards</option>
                <CardsDropDown cards={props.cards} status={"ACTIVE"}/>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="itemDesc">
              <Form.Label>Item Description</Form.Label>
              <Form.Control type="input" maxLength={200}
                name="itemDesc" value={formData.itemDesc} onChange={handleChange}/>
            </Form.Group>
            <Form.Group controlId="purchaseDate">
              <Form.Label>Purchase Date</Form.Label>
              <DatePickerInput value={formData.purchaseDate}
              onChange={handlePurchaseDateChange} readOnly/>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <InputGroup>
                <Form.Control type="number" maxLength={20}
                name="price"
                value={Number(formData.price).toFixed(formData.decimalPlaces)}
                onChange={handleChange}/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">{formData.cardCurrency}</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="noOfInst">
              <Form.Label>Number of Installments</Form.Label>
              <Form.Control type="number" maxLength={20}
              name="noOfInst"
              value={Number(formData.noOfInst).toFixed(0)}
              onChange={handleChange}/>
            </Form.Group>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        </ModalContainer>
    );
}

export default CardInstallmentAddModal;