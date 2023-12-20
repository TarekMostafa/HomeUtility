import React, { Component } from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import DepositRequest from '../../../axios/DepositRequest';

const initialState = {
  reference: '',
  account: '',
  interestDate: '',
  interestAmount: 0,
  currency: '',
  decimalPlaces: 0,
  interestTransType: '',
  message: '',
  isLoading: false,
}

class AddInterestModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.depositId)
      return;
    DepositRequest.getDeposit(this.props.depositId)
    .then( (deposit) => {
      this.setState({
        reference: deposit.reference,
        account: deposit.accountNumber,
        currency: deposit.currencyCode,
        decimalPlaces: deposit.currencyDecimalPlace,
        interestTransType: deposit.interestTransType,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading deposit information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Add Interest" show={this.props.show}
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
          <Form.Group controlId="reference">
            <Form.Label>Deposit Reference</Form.Label>
            <Form.Control type="input" name="reference"
            value={this.state.reference} readOnly/>
          </Form.Group>
          <Form.Group controlId="account">
            <Form.Label>Credit Account</Form.Label>
            <Form.Control type="input" name="account"
            value={this.state.account} readOnly/>
          </Form.Group>
          <Form.Group controlId="interestAmount">
            <Form.Label>Interest Amount</Form.Label>
            <InputGroup>
              <Form.Control type="number" maxLength={20}
                name="interestAmount"
                value={Number(this.state.interestAmount).toFixed(this.state.decimalPlaces)}
                onChange={this.handleChange}/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="interestDate">
            <Form.Label>Interest Date</Form.Label>
            <DatePickerInput value={this.state.interestDate}
              onChange={this.handleInterestDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="interestTransType">
            <Form.Label>Interest Transaction Type</Form.Label>
            <Form.Control as="select" name="interestTransType"
              value={this.state.interestTransType} readOnly>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR="Credit"/>
            </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleInterestDateChange = (jsDate, date) => {
    this.setState({
      interestDate: date
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

  handleClick = () => {
    // Validate Input
    if(!this.state.interestDate) {
      this.setState({message: 'Invalid interest date, should not be empty'});
      return;
    } else if(!this.state.interestAmount) {
      this.setState({message: 'Invalid interest account, should not be zero'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add new deposit
    DepositRequest.addDepositInterest(this.props.depositId,
      this.state.interestAmount,this.state.interestDate)
    .then( (response) => {
      if (typeof this.props.onAddInterest=== 'function') {
        this.props.onAddInterest();
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

export default AddInterestModal;
