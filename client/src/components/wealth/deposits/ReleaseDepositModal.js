import React, { Component } from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import DepositRequest from '../../../axios/DepositRequest';
// import amountFormatter from '../../../utilities/amountFormatter';

const initialState = {
  reference: '',
  account: '',
  amount: '0',
  currency: '',
  releaseDate: '',
  releaseTransType: '',
  decimalPlaces: 0,
  message: '',
  isLoading: false,
}

class ReleaseDepositModal extends Component {
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
        amount: deposit.amountFormatted,
        currency: deposit.currencyCode,
        decimalPlaces: deposit.currencyDecimalPlace,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading deposit information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Release Deposit" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Release'
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
          <Form.Group controlId="amount">
            <Form.Label>Deposit Amount</Form.Label>
            <InputGroup>
              <Form.Control type="input" name="amount"
                // value={amountFormatter(this.state.amount, this.state.decimalPlaces)}
                value={this.state.amount}
                readOnly/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="releaseDate">
            <Form.Label>Release Date</Form.Label>
            <DatePickerInput value={this.state.releaseDate}
              onChange={this.handleReleaseDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="releaseTransType">
            <Form.Label>Release Transaction Type</Form.Label>
            <Form.Control as="select" name="releaseTransType" onChange={this.handleChange}>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR="Credit"/>
            </Form.Control>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleReleaseDateChange = (jsDate, date) => {
    this.setState({
      releaseDate: date
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
    if(!this.state.releaseDate) {
      this.setState({message: 'Invalid release date, should not be empty'});
      return;
    } else if(!this.state.releaseTransType) {
      this.setState({message: 'Invalid release transaction type, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add new deposit
    DepositRequest.releaseDeposit(this.props.depositId,
      this.state.releaseDate, this.state.releaseTransType)
    .then( (response) => {
      if (typeof this.props.onReleaseDeposit=== 'function') {
        this.props.onReleaseDeposit();
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

export default ReleaseDepositModal;
