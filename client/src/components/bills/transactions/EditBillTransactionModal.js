import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import BillDropDown from '../summary/BillsDropDown';
import BillTransDetailList from './BillTransDetailList';

import BillTransactionRequest from '../../../axios/BillTransactionRequest';
import BillRequest from '../../../axios/BillRequest';

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
  billInfo: null,
  message: '',
  isLoading: false,
}

class EditBillTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transId)
      return;
    BillTransactionRequest.getBillTransaction(this.props.transId)
    .then( (trans) => {
      this.loadBillInfo(trans.billId);
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
      this.setState({message: 'Error occured while loading bill trans information' + err});
    })
  }

  loadBillInfo(billId) {
    // Retrieve Bill Information
    BillRequest.getBill(billId)
    .then( billInfo => {
      this.setState({
        billInfo,
      });
    })
    .catch( err => {
      console.log(err);
    })
  }

  render () {
    return (
      <ModalContainer title={"Edit Bill Transaction (Id=" + this.state.transId + ")"} 
        show={this.props.show} onHide={this.props.onHide} onShow={this.handleOnShow}
        size='lg'
        footer={
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
            <Col>
              <Row>
                <Col>
                  <Form.Group controlId="bills">
                    <Form.Label>Bill</Form.Label>
                    <Form.Control as="select" name="bill" readOnly
                      value={this.state.bill}>
                      <option value=''></option>
                      <BillDropDown status="ACTIVE"/>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
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
                    <Form.Control as="select" name="amountType" onChange={this.handleChange}
                    value={this.state.amountType}>
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
                      checked={this.state.outOfFreq} onChange={this.handleChange}
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    });
  }

  handleBillChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      bill : event.target.value,
      decimalPlaces,
      currency
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
    if(!this.state.bill) {
      this.setState({message: 'Invalid bill, should not be empty'});
      return;
    } else if(!this.state.amount) {
      this.setState({message: 'Invalid amount, should not be zero'});
      return;
    } else if(!this.state.amountType) {
      this.setState({message: 'Invalid amount type, should not be empty'});
      return;
    } else if(!this.state.billDate) {
      this.setState({message: 'Invalid bill date'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date'});
      return;
    } else if(this.state.billInfo.billIsTransDetailRequired && this.state.transDetails.length === 0) {
      this.setState({message: 'Invalid Trans Details, you must enter at least one detail'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Edit Bill Transaction
    BillTransactionRequest.updateBillTransaction(this.state.transId, this.state.amount, 
      this.state.billDate, this.state.notes, this.state.outOfFreq, this.state.amountType,
      this.state.postingDate, this.state.transDetails)
    .then( response => {
      if (typeof this.props.onEdit=== 'function') {
        this.props.onEdit();
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

export default EditBillTransactionModal;
