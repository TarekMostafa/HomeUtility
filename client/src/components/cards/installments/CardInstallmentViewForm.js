import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import moment from 'moment';

import CardsDropDown from '../CardsDropDown';

function CardInstallmentViewForm(props) {
    return (
        <React.Fragment>
          <Form.Group controlId="cardId">
            <Form.Label>Card</Form.Label>
            <Form.Control as="select" name="cardId" readOnly
              value={props.cardInstallment.cardId}>
              <option value=''>Cards</option>
              <CardsDropDown cards={props.cards} />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="itemDesc">
            <Form.Label>Item Description</Form.Label>
            <Form.Control type="input" maxLength={200}
              name="itemDesc" value={props.cardInstallment.cInstItemDesc} readOnly/>
          </Form.Group>
          <Form.Group controlId="purchaseDate">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control type="input"
            name="purchaseDate" 
            value={moment(props.cardInstallment.cInstPurchaseDate).format('DD/MM/YYYY')} 
            readOnly/>
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <Form.Control type="number" maxLength={20}
              name="price"
              value={Number(props.cardInstallment.cInstPrice)
                .toFixed(props.cardInstallment.currencyDecimalPlace)}
              readOnly/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                    {props.cardInstallment.cInstCurrency}
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="noOfInst">
            <Form.Label>Number of Installments</Form.Label>
            <Form.Control type="number" maxLength={20}
            name="noOfInst"
            value={Number(props.cardInstallment.cInstNoOfInst).toFixed(0)}
            readOnly/>
          </Form.Group>
        </React.Fragment>
    )
}

export default CardInstallmentViewForm;