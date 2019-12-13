import React, { Component } from 'react';
import { Form, Row, Col, Button, Badge, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import BillsDropDown from '../summary/BillsDropDown'

const initialState = {
  bill: '',
  status: '',
  billDateFrom: '',
  billDateTo: '',
  postingDateFrom: '',
  postingDateTo: '',
  includeNotes: true,
  notes: '',
  amountType:'',
  limit: 10,
}

class BillTransactionSearch extends Component {
  state ={
    ...initialState,
  }

  componentDidUpdate(prevProps) {
    if(prevProps.billId !== this.props.billId) {
      this.setState({
        bill: this.props.billId
      }, () => {
        let event = new Event("change", {bubbles: true});
        const elem = document.getElementById("bill");
        elem.dispatchEvent(event);
      });
    }
  }

  render() {
    return (
      <Form>
          <Row>
            <Col xs={4}>
              <Row>
                <Col xs={9}>
                  <Form.Label>Bills</Form.Label>
                </Col>
                <Col xs={3}>
                  <Badge variant={this.state.status==="CLOSED"?"danger":"success"}>
                  {this.state.status}
                </Badge>
                </Col>
              </Row>
              <Form.Control as="select" name="bill" onChange={this.handleChange}
              value={this.state.bill} id="bill" size="sm">
                <option value=''></option>
                <BillsDropDown />
              </Form.Control>
            </Col>
            <Col xs={2}>
              <Form.Label>Bill Date From</Form.Label>
              <DatePickerInput value={this.state.billDateFrom} 
                onChange={this.handleBillDateFromChange} readOnly small/>
            </Col>
            <Col xs={2}>
              <Form.Label>Bill Date To</Form.Label>
              <DatePickerInput value={this.state.billDateTo}
                onChange={this.handleBillDateToChange} readOnly small/>
            </Col>
            <Col xs={2}>
              <Form.Label>Posting Date From</Form.Label>
              <DatePickerInput value={this.state.postingDateFrom}
                onChange={this.handlePostingDateFromChange} readOnly small/>
            </Col>
            <Col xs={2}>
              <Form.Label>Posting Date To</Form.Label>
              <DatePickerInput value={this.state.postingDateTo}
                onChange={this.handlePostingDateToChange} readOnly small/>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={6}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox name="includeNotes"
                  checked={this.state.includeNotes} onChange={this.handleChange}/>
                </InputGroup.Prepend>
                <Form.Control type="input" placeholder="Notes" size="sm" name="notes"
                onChange={this.handleChange} value={this.state.notes}/>
              </InputGroup>
            </Col>
            <Col xs={2}>
              <Form.Control as="select" size="sm" name="amountType" onChange={this.handleChange}>
                <option value=''>Credit/Debit</option>
                <option value='Credit'>Credit</option>
                <option value='Debit'>Debit</option>
              </Form.Control>
            </Col>
            <Col xs={2}>
              <Form.Control as="select" size="sm" name="limit" onChange={this.handleChange}
                value={this.state.limit}>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Form.Control>
            </Col>
            <Col xs={{offset:0, span:1}}>
              <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
            </Col>
            <Col xs={1}>
              <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
            </Col>
          </Row>
      </Form>
    )
  }

  handleListClick = () => {
    this.props.onListClick(this.state.bill, this.state.billDateFrom, 
      this.state.billDateTo, this.state.postingDateFrom, this.state.postingDateTo,
      this.state.includeNotes, this.state.notes, this.state.amountType, this.state.limit);
  }

  handleResetClick = () => {
    this.setState({
      ...initialState,
    })
    this.props.onResetClick();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    })

    if(event.target.name === 'bill'){
      const status = event.target[event.target.selectedIndex].getAttribute('status');
      this.setState({
        status
      })
    }
  }

  handleBillDateFromChange = (jsDate, date) => {
    this.setState({
      billDateFrom: date
    });
  }

  handleBillDateToChange = (jsDate, date) => {
    this.setState({
      billDateTo: date
    });
  }

  handlePostingDateFromChange = (jsDate, date) => {
    this.setState({
      postingDateFrom: date
    });
  }

  handlePostingDateToChange = (jsDate, date) => {
    this.setState({
      postingDateTo: date
    });
  }
}

BillTransactionSearch.propTypes = {
  onListClick: PropTypes.func,
  onResetClick: PropTypes.func,
  billId: PropTypes.string,
};

BillTransactionSearch.defaultProps = {
  onListClick: () => {},
  onResetClick: () => {},
  billId: '',
}

export default BillTransactionSearch;