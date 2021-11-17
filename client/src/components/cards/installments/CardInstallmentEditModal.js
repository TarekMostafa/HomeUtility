import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import CardsDropDown from '../CardsDropDown';

import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    isLoading: false,
    message: "",
    itemDesc: "",
    purchaseDate: "",
    noOfInst: 0,
}

function CardInstallmentEditModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [cardInstallment, setCardInstallment] = useState(null);

    const loadCardInstallment = (id) => CardInstRequest.getCardInstallment(id)
        .then(  cardInst => {
          setCardInstallment(cardInst);
            if(cardInst) setFormData({
                ...formData,
                itemDesc: cardInst.cInstItemDesc,
                purchaseDate: cardInst.cInstPurchaseDate,
                noOfInst: cardInst.cInstNoOfInst
            });
        });

    useEffect(()=>{
        if(props.cardInstId) loadCardInstallment(props.cardInstId);
    },[props.cardInstId])

    const handleClick = () => {
      // Validate Input
      if(!formData.itemDesc) {
        setFormData({...formData, message: 'Invalid item description, should not be empty'});
        return;
      } else if(!formData.purchaseDate) {
        setFormData({...formData, message: 'Invalid purchase date'});
        return;
      } else if(!formData.noOfInst) {
        setFormData({...formData, message: 'Invalid number of installment, should be greater than zero'});
        return;
      } else {
        setFormData({...formData, message: "", isLoading: true});
      }
      // update card installment
      CardInstRequest.updateCardInstallment(cardInstallment.cInstId,
        formData.itemDesc, formData.purchaseDate, formData.noOfInst)                     
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

    const handlePurchaseDateChange = (jsDate, date) => {
      setFormData({...formData, purchaseDate:date});
    }

    return (
        <ModalContainer title="Edit Card Installment" show={props.show}
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
          cardInstallment && <form>
            <Form.Group controlId="cardId">
              <Form.Label>Card</Form.Label>
              <Form.Control as="select" name="cardId" readOnly
                value={cardInstallment.cardId}>
                <option value=''>Cards</option>
                <CardsDropDown cards={props.cards} />
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
              <Form.Control type="number" maxLength={20}
              name="price"
              value={Number(cardInstallment.cInstPrice).toFixed(cardInstallment.currency.currencyDecimalPlace)}
              readOnly/>
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
        }
        </ModalContainer>
    );
}

export default CardInstallmentEditModal;