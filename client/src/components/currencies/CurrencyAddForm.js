import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CurrencyRequest from '../../axios/CurrencyRequest';

const initialState = {
  currencyCode: '',
  currencyName: '',
  decimalPlace: '',
  message: '',
  messageClass: '',
  addButtonDisabled: true,
}

class CurrencyAddForm extends Component {
  state = {
    ...initialState
  }

  render() {
    return (
      <Form>
        <Row>
          <Col>
            <Form.Control type="input" placeholder="Currency Code" size="sm"
              value={this.state.currencyCode} name="currencyCode"
              onChange={this.handleChange} maxLength={3}/>
          </Col>
          <Col>
            <Form.Control type="input" placeholder="Currency name" size="sm"
            value={this.state.currencyName} name="currencyCode" readOnly/>
          </Col>
          <Col>
            <Form.Control type="input" placeholder="Decimal place" size="sm"
            value={this.state.decimalPlace} name="decimalPlace" readOnly/>
          </Col>
          <Col>
            <Button variant="primary" size="sm"
            disabled={this.state.addButtonDisabled} onClick={this.handleAdd}>Add</Button>
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
    CurrencyRequest.addCurrency(this.state.currencyCode,
      this.state.currencyName, this.state.decimalPlace)
      .then( (result) => {
        if (typeof this.props.onAddCurrency === 'function') {
          this.props.onAddCurrency();
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
    const code = event.target.value.toUpperCase();
    this.setState({
      ...initialState,
      currencyCode : code,
    });
    // Check Currency Code must be equal to 3
    if(code.length === 3){
      CurrencyRequest.getCurrencyInfoByCurrencyCode(code)
      .then( currency => {
        this.setState({
          currencyName: currency.currency,
          decimalPlace: currency.digits,
          addButtonDisabled: false
        })
      })
      .catch( err => {
        this.setState({
          message: err.response.data,
          messageClass: 'text-danger'
        })
      });
    }
  }
}

CurrencyAddForm.propTypes = {
  onAddCurrency: PropTypes.func,
}

export default CurrencyAddForm;
