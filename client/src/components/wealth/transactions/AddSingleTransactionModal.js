import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  account: '',
  postingDate: '',
  amount: 0,
  crdr: 0,
  type: '',
  narrative: '',
  message: '',
  isLoading: false,
}

class AddSingleTransactionModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Add Single Transaction" show={this.props.show}
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
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control as="select" name="account" onChange={this.handleChange}>
              <option value=''></option>
              <AccountsDropDown />
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
            name="amount" value={this.state.amount} onChange={this.handleChange}/>
          </Form.Group>
          <Form.Group controlId="crdr">
            <Row>
              <Col>
                <Form.Label>Credit/Debit</Form.Label>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Credit" value="Credit" name="crdr" onChange={this.handleChange}/>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Debit" name="crdr"  value="Debit" onChange={this.handleChange}/>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" name="type" onChange={this.handleChange}>
              <option value=''></option>
              <TransactionTypesDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="narrative">
            <Form.Label>Narrative</Form.Label>
            <Form.Control type="input" maxLength={200}
            name="narrative" value={this.state.narrative} onChange={this.handleChange}/>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

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

  handleClick = () => {
    // Validate Input
    if(!this.state.account) {
      this.setState({message: 'Invalid account, should not be empty'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date, should not be empty'});
      return;
    } else if(!this.state.amount) {
      this.setState({message: 'Invalid amount, should not be zero'});
      return;
    } else if(!this.state.crdr) {
      this.setState({message: 'Invalid crdr, should not be empty'});
      return;
    } else if(!this.state.type) {
      this.setState({message: 'Invalid type, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    console.log(this.state.crdr);
    // Add single transaction
    TransactionRequest.addSingleTransaction(this.state.account, this.state.postingDate,
    this.state.amount, this.state.crdr, this.state.type, this.state.narrative)
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

export default AddSingleTransactionModal;
