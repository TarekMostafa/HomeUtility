import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import BillDropDown from '../summary/BillsDropDown';
import BillTransDetailList from './BillTransDetailList';

import BillTransactionRequest from '../../../axios/BillTransactionRequest';

const initialState = {
  bill: '',
  currency: '',
  decimalPlaces: 0,
  defaultAmount: 0,
  outOfFreq: false,
  amount: 0,
  amountType: '',
  billDate: '',
  postingDate: new Date(),
  notes: '',
  transDetails: [],
  isBillSelectable: true,
  message: '',
  isLoading: false,
}

class AddBillTransactionModal extends Component {
  state = {
    ...initialState
  }

  render () {
    return (
      <ModalContainer title="Add Bill Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow} size='lg'
        footer={ this.state.isBillSelectable ? "" : 
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Save'
          }
          </Button>
        }>
        <Form>
          <Row>
            <Col xs={9}>
              <Form.Control as="select" name="bill" onChange={this.handleBillChange} 
                readOnly={!this.state.isBillSelectable} value={this.state.bill}>
                <option value=''>Bills</option>
                <BillDropDown status="ACTIVE"/>
              </Form.Control>
            </Col>
            <Col xs={3}>
              { this.state.isBillSelectable &&
                <Button variant="info" size="sm" onClick={this.handleOkClick}>
                { this.state.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'OK'
                }
                </Button> 
              }
            </Col>
          </Row>
          {
            !this.state.isBillSelectable &&
            <React.Fragment>
            <hr />
            <Row>
            <Col>
              <Row>
                <Col>
                  <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                      <Form.Control type="number"
                      name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}
                      onChange={this.handleChange}/>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
                      </InputGroup.Prepend>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="amountType">
                    <Form.Label>Amount Type</Form.Label>
                    <Form.Control as="select" name="amountType" onChange={this.handleChange}>
                      <option value=''></option>
                      <option value='Credit'>Credit</option>
                      <option value='Debit'>Debit</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="billDate">
                    <Form.Label>Bill Date</Form.Label>
                    <DatePickerInput value={this.state.billDate}
                    onChange={this.handleBillDateChange} readOnly/>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="postingDate">
                    <Form.Label>Posting Date</Form.Label>
                    <DatePickerInput value={this.state.postingDate}
                    onChange={this.handlePostingDateChange} readOnly/>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="notes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" maxLength={255} rows="3" style={{resize:"none"}}
                    name="notes" value={this.state.notes} onChange={this.handleChange}/>
                    <Form.Check type="checkbox" label="Out Of Frequency" 
                      value={this.state.outOfFreq} onChange={this.handleChange}
                      name="outOfFreq"/>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col>
            { 
              this.state.bill && <BillTransDetailList billId={this.state.bill} 
              transDetails={this.state.transDetails} onAddItem={this.handleAddItem}
              onRemoveItem={this.handleRemoveItem}/>
            }
            </Col>
          </Row>
          </React.Fragment>
          }
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAddItem = (transDetail) => {
    //Get Index of constructed object if exist
    let transDetails = [...this.state.transDetails];
    const index = transDetails.findIndex( _transDetail => {
      return _transDetail.billItem.billItemId === transDetail.billItem.billItemId;
    });

    if(index < 0) {
      transDetails.push(transDetail);
    } else {
      transDetails[index].detAmount = transDetail.detAmount;
      transDetails[index].detQuantity = transDetail.detQuantity;
      transDetails[index].detAmountType = transDetail.detAmountType;
    }
    
    this.setState({
      transDetails
    });
  }

  handleRemoveItem = (index) => {
    let transDetails = [...this.state.transDetails];
    transDetails.splice(index, 1);
    
    this.setState({
      transDetails
    });
  }

  handleOkClick = () => {
    if(!this.state.bill) {
      this.setState({message: 'Invalid bill, should not be empty'});
      return;
    }

    this.setState({
      isBillSelectable: false, 
      message: '',
      amount: this.state.defaultAmount
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    });
  }

  handleBillChange = (event) => {
    if(!this.state.isBillSelectable) return;

    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    const defaultAmount = event.target[event.target.selectedIndex].getAttribute('defaultAmount');
    this.setState({
      bill : event.target.value,
      decimalPlaces,
      currency,
      defaultAmount
    });
  }

  handleBillDateChange = (jsDate, date) => {
    this.setState({
      billDate: date
    });
  }

  handlePostingDateChange = (jsDate, date) => {
    this.setState({
      postingDate: date
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.amountType) {
      this.setState({message: 'Invalid amount type, should not be empty'});
      return;
    } else if(!this.state.billDate) {
      this.setState({message: 'Invalid bill date'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add Bill Transaction
    BillTransactionRequest.addBillTransaction(this.state.amount, this.state.billDate,
      this.state.notes, this.state.outOfFreq, this.state.amountType, this.state.bill, 
      this.state.postingDate, this.state.transDetails)
    .then( response => {
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
  }//End of handle Click
}

export default AddBillTransactionModal;
