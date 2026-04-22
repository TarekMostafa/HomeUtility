import React, { Component } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

const initialState = {
  postingDateFrom: '',
  postingDateTo: '',
  includeNotes: true,
  notes: '',
  limit: 99,
}

class BillTransactionSimpleSearch extends Component {
  state ={
    ...initialState,
  }

  render() {
    return (
      <Form>
          <Row>
            <Col xs={3}>
              <DatePickerInput value={this.state.postingDateFrom}
                onChange={this.handlePostingDateFromChange} readOnly small
                placeholder='Posting Date From'/>
            </Col>
            <Col xs={3}>
              <DatePickerInput value={this.state.postingDateTo}
                onChange={this.handlePostingDateToChange} readOnly small
                placeholder='Posting Date To'/>
            </Col>
            <Col xs={4}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox name="includeNotes"
                  checked={this.state.includeNotes} onChange={this.handleChange}/>
                </InputGroup.Prepend>
                <Form.Control type="input" placeholder="Notes" size="md" name="notes"
                onChange={this.handleChange} value={this.state.notes}/>
              </InputGroup>
            </Col>
            <Col xs={1}>
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
    this.props.onListClick(this.state.postingDateFrom, this.state.postingDateTo,
      this.state.includeNotes, this.state.notes, this.state.limit);
  }

  handleResetClick = () => {
    this.setState({
      ...initialState,
    })
    if (typeof this.props.onResetClick === 'function') {
      this.props.onResetClick();
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    })
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

BillTransactionSimpleSearch.propTypes = {
  onListClick: PropTypes.func,
  onResetClick: PropTypes.func,
};

BillTransactionSimpleSearch.defaultProps = {
  onListClick: () => {},
  onResetClick: () => {},
}

export default BillTransactionSimpleSearch;