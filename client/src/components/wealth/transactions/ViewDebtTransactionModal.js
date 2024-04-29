import React, { Component } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import DebtorsDropDown from '../../debt/debtors/DebtorsDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  account: '',
  postingDate: '',
  amount: 0,
  crdr: '',
  debtor: '',
  narrative: '',
  decimalPlaces: 0,
  currency: '',
  message: '',
  isLoading: false,
}

class ViewDebtTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transactionId)
      return;
    TransactionRequest.getSingleTransaction(this.props.transactionId)
    .then( (transaction) => {
      this.setState({
        account: transaction.transactionAccount,
        postingDate: transaction.transactionPostingDate,
        amount: transaction.transactionAmount,
        crdr: transaction.transactionCRDR,
        debtor: transaction.transactionModuleId,
        narrative: transaction.transactionNarrative,
        decimalPlaces: transaction.currencyDecimalPlace,
        currency: transaction.accountCurrency
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="View Debt Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
        <Form>
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control as="select" name="account" readOnly
            value={this.state.account}>
              <option value=''></option>
              <AccountsDropDown status='ACTIVE'/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="postingDate">
            <Form.Label>Posting Date</Form.Label>
            <Form.Control type="input"
            name="postingDate" value={moment(this.state.postingDate).format('DD/MM/YYYY')} readOnly/>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control type="number"
              name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}
              readOnly/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="crdr">
            <Row>
              <Col>
                <Form.Label>Credit/Debit</Form.Label>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Credit" name="crdr" value="Credit" 
                readOnly checked={this.state.crdr==='Credit'}/>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Debit" name="crdr"  value="Debit" 
                readOnly checked={this.state.crdr==='Debit'}/>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="debtor">
            <Form.Label>Debtor</Form.Label>
            <Form.Control as="select" name="debtor" readOnly value={this.state.debtor}>
              <option value=''></option>
              <DebtorsDropDown currency={this.state.currency}/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="narrative">
            <Form.Label>Narrative</Form.Label>
            <Form.Control type="input" maxLength={200}
            name="narrative" value={this.state.narrative} readOnly/>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAccountChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      account : event.target.value,
      decimalPlaces,
      currency
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handlePostingDateChange = (jsDate, date) => {
    this.setState({
      postingDate: date
    });
  }
}

export default ViewDebtTransactionModal;
