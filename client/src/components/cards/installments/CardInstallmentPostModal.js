import React, {useState, useEffect} from 'react';
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
    transAmt: 0,
    transDate: new Date(Date.now()),
    transDesc: ""
}

function CardInstallmentPostModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [cardInstallment, setCardInstallment] = useState(null);

    const loadCardInstallment = (id) => CardInstRequest.getCardInstallment(id)
        .then(  cardInst => {
          setCardInstallment(cardInst);
            let tmpTransAmt = Number(cardInst.cInstPrice / cardInst.cInstNoOfInst)
              .toFixed(cardInst.currency.currencyDecimalPlace);
            let diff = cardInst.cInstPrice - cardInst.cInstPosted;
            if(tmpTransAmt > diff) tmpTransAmt= diff;
            if(cardInst) setFormData({
                ...formData,
                transAmt: tmpTransAmt,
                transDesc: `${cardInst.cInstItemDesc} ${cardInst.cInstNoOfPostedInst+1}/${cardInst.cInstNoOfInst}`
            });
        });

    useEffect(()=>{
        if(props.cardInstId) loadCardInstallment(props.cardInstId);
    },[props.cardInstId])

    const handleClick = () => {
      // Validate Input
      if(!formData.transAmt) {
        setFormData({...formData, message: 'Invalid installment amount, should not be zero'});
        return;
      } else if(!formData.transDate) {
        setFormData({...formData, message: 'Invalid installment date'});
        return;
      } else if(!formData.transDesc) {
        setFormData({...formData, message: 'Invalid installment description, should not be empty'});
        return;
      } else {
        setFormData({...formData, message: "", isLoading: true});
      }
      // post card installment
      CardInstRequest.postCardInstallment(cardInstallment.cInstId, 
        formData.transAmt, formData.transDate, formData.transDesc)                     
      .then( () => {
          if (typeof props.onPost=== 'function') {
              props.onPost();
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

    const handleTransDateChange = (jsDate, date) => {
      setFormData({...formData, transDate:date});
    }

    return (
        <ModalContainer title="Post Card Installment" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="success" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Post'
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
            <Form.Group controlId="transAmt">
              <Form.Label>Installment Amount</Form.Label>
              <InputGroup>
                <Form.Control type="number" maxLength={20}
                name="transAmt"
                value={Number(formData.transAmt).toFixed(cardInstallment.currency.currencyDecimalPlace)}
                onChange={handleChange}/>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">{cardInstallment.cInstCurrency}</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="transDate">
              <Form.Label>Installment Date</Form.Label>
              <DatePickerInput value={formData.transDate}
              onChange={handleTransDateChange} readOnly/>
            </Form.Group>
            <Form.Group controlId="transDesc">
              <Form.Label>Installment Description</Form.Label>
              <Form.Control type="input" maxLength={200}
                name="transDesc" value={formData.transDesc} onChange={handleChange}/>
            </Form.Group>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardInstallmentPostModal;