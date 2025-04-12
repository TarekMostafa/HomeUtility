import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';

function ViewSingleTransactionData (props) {
    return (
        <Form>
        <Form.Group controlId="account">
          <Form.Label>Account</Form.Label>
          <Form.Control as="select" name="account" readOnly
          value={props.data.account}>
            <option value=''></option>
            <AccountsDropDown />
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="postingDate">
          <Form.Label>Posting Date</Form.Label>
          <Form.Control type="input"
          name="postingDate" value={moment(props.data.postingDate).format('DD/MM/YYYY')} readOnly/>
        </Form.Group>
        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <InputGroup>
            <Form.Control type="input"
            name="amount"
            value={props.data.amount}
            readOnly/>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">{props.data.currency}</InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="crdr">
          <Row>
            <Col>
              <Form.Label>Credit/Debit</Form.Label>
            </Col>
            <Col>
              <Form.Check inline type="radio" label="Credit" value="Credit"
              name="crdr" readOnly checked={props.data.crdr==='Credit'}/>
            </Col>
            <Col>
              <Form.Check inline type="radio" label="Debit" value="Debit"
              name="crdr" readOnly checked={props.data.crdr==='Debit'}/>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control as="select" name="type" readOnly
          value={props.data.type}>
            <option value=''></option>
            <TransactionTypesDropDown typeCRDR={props.data.crdr}/>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="narrative">
          <Form.Label>Narrative</Form.Label>
          <Form.Control type="input" maxLength={200}
          name="narrative" value={props.data.narrative} readOnly/>
        </Form.Group>
        <Form.Text className='text-danger'>{props.data.message}</Form.Text>
      </Form>
    )
}

export default ViewSingleTransactionData;