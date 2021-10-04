import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ExpenseTypeRequest from '../../../axios/ExpenseTypeRequest';

const initialState = {
  expenseTypeName: '',
  message: '',
  messageClass: ''
}

class ExpenseTypeAddForm extends Component {
  state = {
    ...initialState
  }

  render() {
    return (
      <Form>
        <Row>
          <Col>
            <Form.Control type="input" placeholder="Expense Type Name" size="sm"
              value={this.state.expenseTypeName} name="expenseTypeName"
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
    ExpenseTypeRequest.addExpenseType(this.state.expenseTypeName)
    .then( (result) => {
      if (typeof this.props.onAddExpenseType=== 'function') {
        this.props.onAddExpenseType();
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
    if(!this.state.expenseTypeName) {
      return false;
    }
    return true;
  }
}

ExpenseTypeAddForm.propTypes = {
  onAddExpenseType: PropTypes.func,
}

export default ExpenseTypeAddForm;
