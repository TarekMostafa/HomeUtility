import React, { Component } from 'react';
import { Form, Row, Col, Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import WealthTransactionTable from './WealthTransactionTable';
import FormContainer from '../../common/FormContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import AddSingleTransactionModal from './AddSingleTransactionModal';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  account: '',
  transactionType: '',
  postingDateFrom: '',
  postingDateTo: '',
  narrative: '',
}

const TRANSACTION_LIMIT = 10;

class WealthTransactionList extends Component {

  state = {
    transactions: [],
    appearMoreButton: true,
    modalAddSingleShow: false,
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
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts Transactions" toolbar={
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup className="mr-2" aria-label="First group">
              <Button variant="info" size="sm" onClick={this.handleAddSingleTransaction}>Add Single Transaction</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Second group">
              <Button variant="info" size="sm">Add Internal Transaction</Button>
            </ButtonGroup>
          </ButtonToolbar>
        }>
          <Form>
          <Row>
            <Col>
              <Form.Control as="select" size="sm" name="account" onChange={this.handleChange}
                value={this.state.account}>
                <option value=''>Accounts</option>
                <AccountsDropDown />
              </Form.Control>
            </Col>
            <Col>
              <Form.Control as="select" size="sm" name="transactionType"
                onChange={this.handleChange} value={this.state.transactionType}>
                <option value=''>Transaction Types</option>
                <TransactionTypesDropDown />
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
            <Col xs={{offset:4, span:1}}>
              <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
            </Col>
            <Col xs={1}>
              <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
            </Col>
          </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <WealthTransactionTable transactions={this.state.transactions}/>
          <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
            hidden={!this.state.appearMoreButton}>
            more...</Button>
        </FormContainer>
        <AddSingleTransactionModal show={this.state.modalAddSingleShow} onHide={() => this.handleHide('ADD')}
        onSave={this.handleListClick}/>
      </React.Fragment>
    )
  }// end of render

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

  handleAddSingleTransaction = () => {
    this.setState({
      modalAddSingleShow: true
    });
  }

  handleHide = () => {
    this.setState({
      modalAddSingleShow: false,
    });
  }

}

export default WealthTransactionList;
