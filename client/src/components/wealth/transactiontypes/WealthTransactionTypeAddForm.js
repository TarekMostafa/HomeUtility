import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TransactionTypeRequest from '../../../axios/TransactionTypeRequest';

const initialState = {
  typeName: '',
  typeCRDR: '',
  message: '',
  messageClass: ''
}

class WealthTransactionTypeAddForm extends Component {
  state = {
    ...initialState
  }

  render() {
    return (
      <Form>
        <Row>
          <Col>
            <Form.Control type="input" placeholder="Type Name" size="sm"
              value={this.state.typeName} name="typeName"
              onChange={this.handleChange} maxLength={45}/>
          </Col>
          <Col>
            <Form.Control as="select" size="sm" name="typeCRDR" onChange={this.handleChange}
              value={this.state.typeCRDR}>
              <option value=''>Credit/Debit</option>
              <option value='Credit'>Credit</option>
              <option value='Debit'>Debit</option>
            </Form.Control>
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
    TransactionTypeRequest.addTransactionType(this.state.typeName, this.state.typeCRDR)
    .then( (result) => {
      if (typeof this.props.onAddTransactionType=== 'function') {
        this.props.onAddTransactionType();
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
    this.setState({
      [event.target.name] : event.target.value,
    });
  }//end of handleChange

  validateForm = () => {
    if(this.state.typeName === '') {
      return false;
    }
    if(this.state.typeCRDR === '') {
      return false;
    }
    return true;
  }
}

WealthTransactionTypeAddForm.propTypes = {
  onAddTransactionType: PropTypes.func,
}

export default WealthTransactionTypeAddForm;
