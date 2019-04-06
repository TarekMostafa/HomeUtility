import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import WealthTransactionTable from './WealthTransactionTable';
import FormContainer from '../../common/FormContainer';

import TransactionRequest from '../../../axios/TransactionRequest';
import AccountRequest from '../../../axios/AccountRequest';
import TransactionTypeRequest from '../../../axios/TransactionTypeRequest';

const initialState = {
  account: '',
  transactionType: '',
  postingDateFrom: '',
  postingDateTo: '',
  narrative: '',
}

const TRANSACTION_LIMIT = 10;

class WealthTransactionSearch extends Component {

  state = {
    transactions: [],
    accounts: [],
    transactionTypes: [],
    appearMoreButton: true,
    ...initialState,
  }

  loadTransctions(limit, skip, append) {
    TransactionRequest.getTransactions(limit, skip, this.state.account,
      this.state.transactionType, this.state.postingDateFrom, this.state.postingDateTo,
      this.state.narrative)
    .then( (transactions) => {
      let _transactions = [];
      if(append) {
        _transactions = [...this.state.transactions, ...transactions];
      } else {
        _transactions = [...transactions];
      }
      this.setState({
        transactions: _transactions,
        appearMoreButton: (transactions.length >= TRANSACTION_LIMIT)
      });
    });
  }

  componentDidMount() {
    this.loadTransctions(TRANSACTION_LIMIT, 0, false);
    AccountRequest.getAccountsForDropDown()
    .then( (accounts) => {
      this.setState({
        accounts
      });
    });
    TransactionTypeRequest.getTransactionTypesForDropDown()
    .then( (transactionTypes) => {
      this.setState({
        transactionTypes
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Transactions">
          <Form>
          <Row>
            <Col>
              <Form.Control as="select" size="sm" name="account" onChange={this.handleChange}
                value={this.state.account}>
                <option value=''>Accounts</option>
                { this.listAccounts() }
              </Form.Control>
            </Col>
            <Col>
              <Form.Control as="select" size="sm" name="transactionType"
                onChange={this.handleChange} value={this.state.transactionType}>
                <option value=''>Transaction Types</option>
                { this.listTransactionTypes() }
              </Form.Control>
            </Col>
            <Col>
              <DatePickerInput value={this.state.postingDateFrom}
              onChange={this.handlePostingDateFromChange} readOnly placeholder="Posting Date From" small/>
            </Col>
            <Col>
              <DatePickerInput value={this.state.postingDateTo}
              onChange={this.handlePostingDateToChange} readOnly placeholder="Posting Date To" small/>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={6}>
              <Form.Control type="input" placeholder="Narrative" size="sm" name="narrative"
              onChange={this.handleChange} value={this.state.narrative}/>
            </Col>
            <Col xs={1}>
              <Button variant="primary" size="sm" onClick={this.handleListClick}>List</Button>
            </Col>
            <Col xs={1}>
              <Button variant="secondary" size="sm" onClick={this.handleResetClick}>Reset</Button>
            </Col>
          </Row>
          </Form>
        </FormContainer>
        <WealthTransactionTable transactions={this.state.transactions}/>
        <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
          hidden={!this.state.appearMoreButton}>
          more...</Button>
      </React.Fragment>
    )
  }// end of render

  listAccounts = () => {
    return this.state.accounts && this.state.accounts.map( (account) => {
      return (
        <option key={account.accountId} value={account.accountId}>{account.accountNumber}</option>
      )
    });
  }

  listTransactionTypes = () => {
    return this.state.transactionTypes && this.state.transactionTypes.map( (transactionType) => {
      return (
        <option key={transactionType.typeId} value={transactionType.typeId}>
          {transactionType.typeName}</option>
      )
    });
  }

  handleListClick = () => {
    this.loadTransctions(TRANSACTION_LIMIT, 0, false);
  }

  handleMoreClick = () => {
    this.loadTransctions(TRANSACTION_LIMIT, this.state.transactions.length, true);
  }

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handlePostingDateFromChange = (jsDate, date) => {
    this.setState({
      postingDateFrom: date
    });
  }

  handlePostingDateToChange = (jsDate, date) => {
    this.setState({
      postingDateTo: date
    });
  }

}

export default WealthTransactionSearch;
