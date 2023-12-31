import React, { Component } from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

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
  currencyFrom: '',
  currencyTo: '',
  message: '',
  isLoading: false,
}

class AddInternalTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    TransactionRequest.getInternalTransactionDefaults()
    .then(defaults => {
      this.setState({
        accountFrom: defaults.accountFrom,
        typeFrom: defaults.typeFrom,
        //postingDate: defaults.postingDate,
        amount: defaults.amount,
        accountTo: defaults.accountTo,
        typeTo: defaults.typeTo,
      })
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading default values'});
    })
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
            <Form.Control as="select" name="accountFrom" onChange={this.handleAccountFromChange}
            value={this.state.accountFrom}>
              <option value=''></option>
              <AccountsDropDown status='ACTIVE'/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="typeFrom">
            <Form.Label>Type From</Form.Label>
            <Form.Control as="select" name="typeFrom" onChange={this.handleChange}
            value={this.state.typeFrom}>
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
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currencyFrom}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="number"
              name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}
              onChange={this.handleChange}/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currencyTo}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="accountTo">
            <Form.Label>Account To</Form.Label>
            <Form.Control as="select" name="accountTo" onChange={this.handleAccountToChange}
            value={this.state.accountTo}>
              <option value=''></option>
              <AccountsDropDown status='ACTIVE'/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="typeTo">
            <Form.Label>Type To</Form.Label>
            <Form.Control as="select" name="typeTo" onChange={this.handleChange}
            value={this.state.typeTo}>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR="Credit"/>
            </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAccountFromChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      accountFrom : event.target.value,
      decimalPlaces,
      currencyFrom: currency
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleAccountToChange = (event) => {
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      accountTo : event.target.value,
      currencyTo: currency
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
