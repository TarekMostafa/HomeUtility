import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  accountFrom: '',
  typeFrom: '',
  postingDate: '',
  amount: 0,
  accountTo: '',
  typeTo: '',
  decimalPlaces: 0,
  message: '',
  isLoading: false,
}

class AddInternalTransactionModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Add Internal Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="accountFrom">
            <Form.Label>Account From</Form.Label>
            <Form.Control as="select" name="accountFrom" onChange={this.handleAccountChange}>
              <option value=''></option>
              <AccountsDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="typeFrom">
            <Form.Label>Type From</Form.Label>
            <Form.Control as="select" name="typeFrom" onChange={this.handleChange}>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR="Debit"/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="postingDate">
            <Form.Label>Posting Date</Form.Label>
            <DatePickerInput value={this.state.postingDate}
            onChange={this.handlePostingDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number"
            name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}
            onChange={this.handleChange}/>
          </Form.Group>
          <Form.Group controlId="accountTo">
            <Form.Label>Account To</Form.Label>
            <Form.Control as="select" name="accountTo" onChange={this.handleChange}>
              <option value=''></option>
              <AccountsDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="typeTo">
            <Form.Label>Type To</Form.Label>
            <Form.Control as="select" name="typeTo" onChange={this.handleChange}>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR="Credit"/>
            </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAccountChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    this.setState({
      accountFrom : event.target.value,
      decimalPlaces
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handlePostingDateChange = (jsDate, date) => {
    this.setState({
      postingDate: date
    });
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.accountFrom) {
      this.setState({message: 'Invalid account from, should not be empty'});
      return;
    } else if(!this.state.typeFrom) {
      this.setState({message: 'Invalid type from, should not be empty'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date, should not be empty'});
      return;
    } else if(!this.state.amount) {
      this.setState({message: 'Invalid amount, should not be zero'});
      return;
    } else if(!this.state.accountTo) {
      this.setState({message: 'Invalid account to, should not be empty'});
      return;
    } else if(!this.state.typeTo) {
      this.setState({message: 'Invalid type To, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add internal transaction
    TransactionRequest.addInternalTransaction(this.state.accountFrom, this.state.typeFrom,
    this.state.postingDate, this.state.amount, this.state.accountTo, this.state.typeTo)
    .then( (response) => {
      if (typeof this.props.onSave=== 'function') {
        this.props.onSave();
      }
      this.setState({isLoading: false});
      this.props.onHide();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        isLoading: false,
      })
    })
  }
}

export default AddInternalTransactionModal;
