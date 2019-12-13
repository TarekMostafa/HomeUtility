import React, { Component } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import BillDropDown from '../summary/BillsDropDown';
import BillTransDetailList from './BillTransDetailList';

import BillTransactionRequest from '../../../axios/BillTransactionRequest';

const initialState = {
  bill: '',
  currency: '',
  decimalPlaces: 0,
  outOfFreq: false,
  amount: 0,
  amountType: '',
  billDate: '',
  postingDate: '',
  notes: '',
  transId: '',
  transDetails: [],
  message: '',
  isLoading: false,
}

class ViewBillTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transId)
      return;
    BillTransactionRequest.getBillTransaction(this.props.transId)
    .then( (trans) => {
      this.setState({
        bill: trans.billId,
        currency: trans.transCurrency,
        decimalPlaces: trans.currency.currencyDecimalPlace,
        outOfFreq: trans.transOutOfFreq,
        amount: trans.transAmount,
        amountType: trans.transAmountType,
        billDate: trans.transBillDate,
        postingDate: trans.transPostingDate,
        notes: trans.transNotes,
        transId: trans.transId,
        transDetails: trans.billTransactionDetails,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading bill trans information ' + err});
    })
  }

  render () {
    return (
      <ModalContainer title={"View Bill Transaction (Id=" + this.state.transId + ")"}  
        show={this.props.show} onHide={this.props.onHide} onShow={this.handleOnShow} size='lg'>
        <Form>
          <Row>
            <Col>
              <Row>
              <Col>
                <Form.Group controlId="bills">
                  <Form.Label>Bill</Form.Label>
                  <Form.Control as="select" name="bill" value={this.state.bill} readOnly>
                    <option value=''></option>
                    <BillDropDown/>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
              <Row>
              <Col>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" readOnly
                    name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}/>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="amountType">
                  <Form.Label>Amount Type</Form.Label>
                  <Form.Control type="text" readOnly name="type"
                  value={this.state.amountType} />
                </Form.Group>
              </Col>
            </Row>
              <Row>
              <Col>
                <Form.Group controlId="billDate">
                    <Form.Label>Bill Date</Form.Label>
                    <Form.Control type="input"
                    name="billDate" 
                    value={moment(this.state.billDate).format('DD/MM/YYYY')} readOnly/>
                  </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="postingDate">
                  <Form.Label>Posting Date</Form.Label>
                  <Form.Control type="input"
                  name="postingDate" 
                  value={moment(this.state.postingDate).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
              </Col>
            </Row>
              <Row>
            <Col>
              <Form.Group controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" maxLength={255} rows="3" style={{resize:"none"}}
                name="notes" value={this.state.notes} readOnly/>
                <Form.Check type="checkbox" label="Out Of Frequency" 
                     checked={this.state.outOfFreq} readOnly/>
              </Form.Group>
            </Col>
          </Row>
            </Col>
            <Col>
            {
              this.state.bill && <BillTransDetailList billId={this.state.bill} 
              transDetails={this.state.transDetails}/>
            }
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

export default ViewBillTransactionModal;
