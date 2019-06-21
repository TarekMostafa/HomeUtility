import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import DepositRequest from '../../../axios/DepositRequest';

const initialState = {
  depositReference: '',
  depositAccount: '',
  depositAmount: 0,
  depositRate: 0,
  depositStartDate: '',
  depositEndDate: '',
  depositTransDebitType: '',
  depositInterestCreditType: '',
  decimalPlaces: 0,
  message: '',
  isLoading: false,
}

class AddNewDepositModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Create New Deposit" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Create'
          }
          </Button>
        }>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="depositReference">
                <Form.Label>Deposit Reference</Form.Label>
                <Form.Control type="input" maxLength={20}
                name="depositReference" value={this.state.depositReference} onChange={this.handleChange}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositAccount">
                <Form.Label>Withdrawn Account</Form.Label>
                <Form.Control as="select" name="depositAccount" onChange={this.handleAccountChange}>
                  <option value=''></option>
                  <AccountsDropDown status='ACTIVE'/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositAmount">
                <Form.Label>Deposit Amount</Form.Label>
                <Form.Control type="number" maxLength={20}
                name="depositAmount"
                value={Number(this.state.depositAmount).toFixed(this.state.decimalPlaces)}
                onChange={this.handleChange}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositRate">
                <Form.Label>Deposit Rate</Form.Label>
                <Form.Control type="number" maxLength={20}
                name="depositRate"
                value={Number(this.state.depositRate).toFixed(2)}
                onChange={this.handleChange}/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositStartDate">
                <Form.Label>Start Date</Form.Label>
                <DatePickerInput value={this.state.depositStartDate}
                onChange={this.handleStartDateChange} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositEndDate">
                <Form.Label>End Date</Form.Label>
                <DatePickerInput value={this.state.depositEndDate}
                onChange={this.handleEndDateChange} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositTransDebitType">
                <Form.Label>Withdrawn Transaction Type</Form.Label>
                <Form.Control as="select" name="depositTransDebitType" onChange={this.handleChange}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Debit"/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositInterestCreditType">
                <Form.Label>Interest Transaction Type</Form.Label>
                <Form.Control as="select" name="depositInterestCreditType" onChange={this.handleChange}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Credit"/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAccountChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    this.setState({
      depositAccount : event.target.value,
      decimalPlaces
    });
  }

  handleStartDateChange = (jsDate, date) => {
    this.setState({
      depositStartDate: date
    });
  }

  handleEndDateChange = (jsDate, date) => {
    this.setState({
      depositEndDate: date
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
    if(!this.state.depositReference) {
      this.setState({message: 'Invalid deposit reference, should not be empty'});
      return;
    } else if(!this.state.depositAccount) {
      this.setState({message: 'Invalid deposit account, should not be empty'});
      return;
    } else if(!this.state.depositAmount) {
      this.setState({message: 'Invalid deposit amount, should not be zero'});
      return;
    } else if(!this.state.depositRate) {
      this.setState({message: 'Invalid deposit rate, should not be zero'});
      return;
    } else if(!this.state.depositStartDate) {
      this.setState({message: 'Invalid deposit start date'});
      return;
    } else if(!this.state.depositEndDate) {
      this.setState({message: 'Invalid deposit end date'});
      return;
    } else if(!this.state.depositTransDebitType) {
      this.setState({message: 'Invalid deposit transaction debit type'});
      return;
    } else if(!this.state.depositInterestCreditType) {
      this.setState({message: 'Invalid deposit interest credit type'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add new deposit
    DepositRequest.addNewDeposit(this.state.depositReference,
      this.state.depositAccount, this.state.depositAmount,
      this.state.depositRate, this.state.depositStartDate,
      this.state.depositEndDate, this.state.depositTransDebitType,
      this.state.depositInterestCreditType)
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

export default AddNewDepositModal;
