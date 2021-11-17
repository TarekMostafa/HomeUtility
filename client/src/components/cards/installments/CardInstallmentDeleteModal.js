import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import CardsDropDown from '../CardsDropDown';

import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function CardInstallmentDeleteModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [cardInstallment, setCardInstallment] = useState(null);

    const loadCardInstallment = (id) => CardInstRequest.getCardInstallment(id)
        .then(cardInst => setCardInstallment(cardInst));

    useEffect(()=>{
        if(props.cardInstId) loadCardInstallment(props.cardInstId);
    },[props.cardInstId])

    const handleClick = () => {
      setFormData({...formData, message: "", isLoading: true});
      // update card
      CardInstRequest.deleteCardInstallment(cardInstallment.cInstId)                   
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
        <ModalContainer title="Delete Card Installment" show={props.show}
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
              name="itemDesc" value={cardInstallment.cInstItemDesc} readOnly/>
          </Form.Group>
          <Form.Group controlId="purchaseDate">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control type="input"
            name="purchaseDate" 
            value={moment(cardInstallment.cInstPurchaseDate).format('DD/MM/YYYY')} 
            readOnly/>
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
            value={Number(cardInstallment.cInstNoOfInst).toFixed(0)}
            readOnly/>
          </Form.Group>
          <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardInstallmentDeleteModal;