import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BankRequest from '../../../axios/BankRequest';

const initialState = {
  bankCode: '',
  bankName: '',
  message: '',
  messageClass: ''
}

class WealthBankAddForm extends Component {
  state = {
    ...initialState
  }

  render() {
    return (
      <Form>
        <Row>
          <Col>
            <Form.Control type="input" placeholder="Bank Code" size="sm"
              value={this.state.bankCode} name="bankCode"
              onChange={this.handleChange} maxLength={3}/>
          </Col>
          <Col>
            <Form.Control type="input" placeholder="Bank name" size="sm"
            value={this.state.bankName} name="bankName"
            onChange={this.handleChange} maxLength={45}/>
          </Col>
          <Col>
            <Button variant="primary" size="sm"
            disabled={!this.validateForm()} onClick={this.handleAdd}>Add</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
          </Col>
        </Row>
      </Form>
    )
  }//end of render

  handleAdd = () => {
    BankRequest.addBank(this.state.bankCode, this.state.bankName)
    .then( (result) => {
      if (typeof this.props.onAddBank=== 'function') {
        this.props.onAddBank();
      }
      this.setState({
        ...initialState,
        message: result.data,
        messageClass: 'text-success'
      });
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger'
      })
    })
  }

  handleChange = (event) => {
    let value = event.target.value;
    if(event.target.name === 'bankCode') {
      value = value.toUpperCase();
    }
    this.setState({
      [event.target.name] : value,
    });
  }//end of handleChange

  validateForm = () => {
    if(this.state.bankCode === '') {
      return false;
    }
    if(this.state.bankName === '') {
      return false;
    }
    return true;
  }
}

WealthBankAddForm.propTypes = {
  onAddBank: PropTypes.func,
}

export default WealthBankAddForm;
