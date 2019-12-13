import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import Chips from 'react-chips';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import FrequenciesDropDown from './BillFrequenciesDropDown';
import BillRequest from '../../../axios/BillRequest';

const initialState = {
  billName: '',
  billFrequency: '',
  billCurrency: '',
  billStartDate: '',
  billDefaultAmount: 0,
  billIsDetailRequired: false,
  decimalPlaces: 0,
  items: [],
  message: '',
  isLoading: false,
}

class AddNewBillModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Create New Bill" show={this.props.show}
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
              <Form.Group controlId="billName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="input" maxLength={20}
                name="billName" value={this.state.billName} onChange={this.handleChange}/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billFrequency">
                <Form.Label>Frequency</Form.Label>
                <Form.Control as="select" name="billFrequency" onChange={this.handleChange}>
                  <option value=''></option>
                  <FrequenciesDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="billCurrency">
                <Form.Label>Currency</Form.Label>
                <Form.Control as="select" name="billCurrency" onChange={this.handleCurrencyChange}>
                  <option value=''></option>
                  <CurrenciesDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billStartDate">
                <Form.Label>Start Date</Form.Label>
                <DatePickerInput value={this.state.billStartDate}
                onChange={this.handleStartDateChange} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="billDefaultAmount">
                <Form.Label>Default Amount</Form.Label>
                <Form.Control type="number" maxLength={20}
                name="billDefaultAmount"
                value={Number(this.state.billDefaultAmount).toFixed(this.state.decimalPlaces)}
                onChange={this.handleChange}/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billIsDetailRequired">
                <Form.Check type="checkbox" label="Bill item is required with every bill transaction" 
                  value={this.state.billIsDetailRequired} onChange={this.handleChange}
                  name="billIsDetailRequired"/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="items">
                <Form.Label>{'Bill Items (' + this.state.items.length + ')' }</Form.Label>
                <Chips value={this.state.items} onChange={this.handleChipChange} 
                  name="items" />
                <Form.Text className="text-muted">
                   Write item and then press TAB.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleChipChange = (chips) => {
    this.setState({
      items: chips
    })
  }

  handleCurrencyChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    this.setState({
      billCurrency : event.target.value,
      decimalPlaces
    });
  }

  handleStartDateChange = (jsDate, date) => {
    this.setState({
      billStartDate: date
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.billName) {
      this.setState({message: 'Invalid bill name, should not be empty'});
      return;
    } else if(!this.state.billFrequency) {
      this.setState({message: 'Invalid bill frequency, should not be empty'});
      return;
    } else if(!this.state.billCurrency) {
      this.setState({message: 'Invalid bill currency, should not be empty'});
      return;
    } else if(!this.state.billStartDate) {
      this.setState({message: 'Invalid bill start date'});
      return;
    } else if(this.state.billIsDetailRequired && this.state.items.length === 0) {
      this.setState({message: 'Invalid bill items, at least one item must be inserted'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add new bill
    BillRequest.addNewBill(this.state.billName,
      this.state.billFrequency, this.state.billCurrency,
      this.state.billStartDate, this.state.billDefaultAmount,
      this.state.billIsDetailRequired, this.state.items)
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

export default AddNewBillModal;
