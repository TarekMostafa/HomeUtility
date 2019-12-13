import React, { Component } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import Chips from 'react-chips';

import 'moment/locale/en-gb.js';
import moment from 'moment';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import EditBillItemsModal from './EditBillItemsModal';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import FrequenciesDropDown from './BillFrequenciesDropDown';
import BillStatusesDropDown from './BillStatusesDropDown';
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
  billItems: [],
  items: [],
  message: '',
  isLoading: false,
}

class EditBillModal extends Component {
  state = {
    ...initialState,
    showEditBillItems: false
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
        billItems: bill.billItems,
        items
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading bill information' + err});
    })
  }

  render () {
    return (
      <ModalContainer title={"Edit Bill (Id=" + this.props.billId + ")"} show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
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
                <Form.Control as="select" name="billFrequency" 
                value={this.state.billFrequency} onChange={this.handleChange}>
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
                <Form.Control as="select" name="billStatus" 
                value={this.state.billStatus} onChange={this.handleChange}>
                  <BillStatusesDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="billIsTransDetailRequired">
                <Form.Check type="checkbox" label="Bill item is required with every bill transaction" 
                  checked={this.state.billIsTransDetailRequired} onChange={this.handleChange}
                  name="billIsTransDetailRequired"/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="items">
                <Row>
                  <Col xs={9}>
                    <Form.Label>{'Bill Items (' + this.state.items.length + ')' }</Form.Label>
                  </Col>
                  <Col xs={3}>
                    <Button variant="link" onClick={this.handleEditItemsClick}>Edit Items</Button>
                  </Col>
                </Row>
                <Chips value={this.state.items} readOnly 
                  name="items"/>
              </Form.Group>
            </Col>
          </Row>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
        {
          this.state.showEditBillItems && <EditBillItemsModal billId={this.state.billId}
          show={this.state.showEditBillItems} onHide={this.handleHide} billItems={this.state.billItems}
          onOkClick={this.handleOkClick}/>
        }
      </ModalContainer>
    )
  }//end of render

  handleOkClick = (billItems) => {
    const items = billItems.map(item => item.billItemName + " (" + item.billItemId + ")");

    this.setState({
      items, billItems
    })
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleEditItemsClick = () => {
    this.setState({
      showEditBillItems: true
    });
  }

  handleHide = () => {
    this.setState({
      showEditBillItems: false
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    });
  }

  handleStartDateChange = (jsDate, date) => {
    this.setState({
      billStartDate: date
    });
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.billName) {
      this.setState({message: 'Invalid bill name, should not be empty'});
      return;
    } else if(this.state.billIsTransDetailRequired && this.state.items.length === 0) {
      this.setState({message: 'Invalid bill items, at least one item must be inserted'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Update Bill
    BillRequest.updateBill(this.props.billId, this.state.billName,
      this.state.billFrequency, this.state.billStartDate, 
      this.state.billDefaultAmount, this.state.billStatus,
      this.state.billIsTransDetailRequired, this.state.billItems)
    .then( (response) => {
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
  }

}

export default EditBillModal;
