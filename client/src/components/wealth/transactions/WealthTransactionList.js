import React, { Component } from 'react';
import { Form, Row, Col, Button, ButtonToolbar, ButtonGroup, InputGroup } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import WealthTransactionTable from './WealthTransactionTable';
import FormContainer from '../../common/FormContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import AddSingleTransactionModal from './AddSingleTransactionModal';
import AddInternalTransactionModal from './AddInternalTransactionModal';
import EditSingleTransactionModal from './EditSingleTransactionModal';
import DeleteSingleTransactionModal from './DeleteSingleTransactionModal';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  account: '',
  transactionType: '',
  postingDateFrom: '',
  postingDateTo: '',
  narrative: '',
  limit: 10,
  id: '',
  includeNarrative: true,
}

class WealthTransactionList extends Component {

  state = {
    transactions: [],
    appearMoreButton: true,
    modalAddSingleShow: false,
    modalAddInternalShow: false,
    modalEditSingleShow: false,
    modalDeleteSingleShow: false,
    transactionId: '',
    ...initialState,
  }

  loadTransctions(append) {
    TransactionRequest.getTransactions(this.state.limit,
      (append?this.state.transactions.length:0),
      this.state.account, this.state.transactionType,
      this.state.postingDateFrom, this.state.postingDateTo,
      this.state.narrative, this.state.id, this.state.includeNarrative)
    .then( (transactions) => {
      let _transactions = [];
      if(append) {
        _transactions = [...this.state.transactions, ...transactions];
      } else {
        _transactions = [...transactions];
      }
      this.setState({
        transactions: _transactions,
        appearMoreButton: (transactions.length >= this.state.limit)
      });
    });
  }

  componentDidMount() {
    this.loadTransctions(false);
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
              <Button variant="info" size="sm" onClick={this.handleAddInternalTransaction}>Add Internal Transaction</Button>
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
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox name="includeNarrative"
                  checked={this.state.includeNarrative} onChange={this.handleChange}/>
                </InputGroup.Prepend>
                <Form.Control type="input" placeholder="Narrative" size="sm" name="narrative"
                onChange={this.handleChange} value={this.state.narrative}/>
              </InputGroup>
            </Col>
            <Col xs={2}>
              <Form.Control as="select" size="sm" name="limit" onChange={this.handleChange}
                value={this.state.limit}>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Form.Control>
            </Col>
            <Col xs={2}>
              <Form.Control type="number" placeholder="Id" size="sm" name="id"
              onChange={this.handleChange} value={this.state.id}/>
            </Col>
            <Col xs={1}>
              <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
            </Col>
            <Col xs={1}>
              <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
            </Col>
          </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <WealthTransactionTable transactions={this.state.transactions}
          onEditTransaction={this.handleEditTransaction}
          onDeleteTransaction={this.handleDeleteTransaction}/>
          <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
            hidden={!this.state.appearMoreButton}>
            more...</Button>
        </FormContainer>
        <AddSingleTransactionModal show={this.state.modalAddSingleShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        <AddInternalTransactionModal show={this.state.modalAddInternalShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        {
          this.state.modalEditSingleShow &&
          <EditSingleTransactionModal show={this.state.modalEditSingleShow} onHide={this.handleHide}
          onSave={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalDeleteSingleShow &&
          <DeleteSingleTransactionModal show={this.state.modalDeleteSingleShow} onHide={this.handleHide}
          onDelete={this.handleListClick} transactionId={this.state.transactionId}/>
        }
      </React.Fragment>
    )
  }// end of render

  handleListClick = () => {
    this.loadTransctions(false);
  }

  handleMoreClick = () => {
    this.loadTransctions(true);
  }

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
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

  handleAddInternalTransaction = () => {
    this.setState({
      modalAddInternalShow: true
    });
  }

  handleHide = () => {
    this.setState({
      modalAddSingleShow: false,
      modalAddInternalShow: false,
      modalEditSingleShow: false,
      modalDeleteSingleShow: false
    });
  }

  handleEditTransaction = (transactionId) => {
    this.setState({
      modalEditSingleShow: true,
      transactionId
    });
  }

  handleDeleteTransaction = (transactionId) => {
    this.setState({
      modalDeleteSingleShow: true,
      transactionId
    });
  }

}

export default WealthTransactionList;
