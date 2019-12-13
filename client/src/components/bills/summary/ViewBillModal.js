import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Chips from 'react-chips';

import 'moment/locale/en-gb.js';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import FrequenciesDropDown from './BillFrequenciesDropDown';
import BillRequest from '../../../axios/BillRequest';

const initialState = {
  billId: 0,
  billStatus: '',
  billName: '',
  billFrequency: '',
  billCurrency: '',
  billStartDate: '',
  billDefaultAmount: 0,
  billIsTransDetailRequired: false,
  billLastBillPaidDate: '',
  decimalPlaces: 0,
  items: [],
  message: '',
  isLoading: false,
}

class ViewBillModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.billId)
      return;
    BillRequest.getBill(this.props.billId)
    .then( (bill) => {
      const items = bill.billItems.map( item => item.billItemName + " (" + item.billItemId + ")");
      this.setState({
        billId: bill.billId,
        billStatus: bill.billStatus,
        billName: bill.billName,
        billFrequency: bill.billFrequency,
        billCurrency: bill.billCurrency,
        billStartDate: bill.billStartDate,
        billDefaultAmount: bill.billDefaultAmount,
        billIsTransDetailRequired: bill.billIsTransDetailRequired,
        billLastBillPaidDate: bill.billLastBillPaidDate,
        decimalPlaces: bill.currency.currencyDecimalPlace,
        items
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading bill information' + err});
    })
  }

  render () {
    return (
      <ModalContainer title={"View Bill (Id=" + this.props.billId + ")"} show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="billName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="input" maxLength={20}
                name="billName" value={this.state.billName} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billFrequency">
                <Form.Label>Frequency</Form.Label>
                <Form.Control as="select" name="billFrequency" 
                value={this.state.billFrequency} readOnly>
                  <option value=''></option>
                  <FrequenciesDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="billCurrency">
                <Form.Label>Currency</Form.Label>
                <Form.Control as="select" name="billCurrency" 
                value={this.state.billCurrency} readOnly>
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
                <Form.Control type="input"
                name="billStartDate"
                value={moment(this.state.billStartDate).format('DD/MM/YYYY')} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="billDefaultAmount">
                <Form.Label>Default Amount</Form.Label>
                <Form.Control type="number" maxLength={20}
                name="billDefaultAmount"
                value={Number(this.state.billDefaultAmount).toFixed(this.state.decimalPlaces)}
                readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billLastBillPaidDate">
                <Form.Label>Last Bill Paid Date</Form.Label>
                <Form.Control type="input"
                name="billLastBillPaidDate"
                value={ this.state.billLastBillPaidDate ?
                  moment(this.state.billLastBillPaidDate).format('DD/MM/YYYY') : ""
                  } readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="billStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control type="input" maxLength={20}
                name="billStatus" value={this.state.billStatus} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billIsTransDetailRequired">
                <Form.Check type="checkbox" label="Bill item is required with every bill transaction" 
                  checked={this.state.billIsTransDetailRequired} readOnly
                  name="billIsTransDetailRequired"/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="items">
                <Form.Label>{'Bill Items (' + this.state.items.length + ')' }</Form.Label>
                <Chips value={this.state.items} readOnly 
                  name="items"/>
              </Form.Group>
            </Col>
          </Row>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

}

export default ViewBillModal;
