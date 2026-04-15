import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';

const initialState = {
  billItemIndex: 0,
  billItemId: 0,
  billItemName: '',
  amount: 0,
  quantity: 1,
  itemType: 'REF',
  billItemText: '',
  type: '',
  message: '',
  isLoading: false,
}

class EditBillTransDetailModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    const index = this.props.selectedIndex;
    const billItem = {...this.props.billItem};
    setTimeout(
      () => {
        this.setState({
          billItemIndex: index, 
          billItemId: (billItem.billItemId===null?0:billItem.billItemId),
          billItemName: billItem.billItemName,
          amount: billItem.detAmount,
          quantity: billItem.detQuantity,
          itemType: billItem.detItemType,
          billItemText: billItem.detItemText,
          type: billItem.detAmountType,
        });
      }
    )
  }

  render () {
    return (
      <ModalContainer title="Edit Bill Item Detail" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow} size="sm"
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
                <Form.Check inline type="radio" label="Reference" 
                name="itemType" value="REF" onChange={this.handleChange}
                checked={this.state.itemType==='REF'}/>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Free Text" 
                name="itemType" value="FREE" onChange={this.handleChange}
                checked={this.state.itemType==='FREE'}/>
              </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="billItem">
                        <Form.Label>Bill Item</Form.Label>
                        {
                          this.state.itemType==='FREE' ?
                          <Form.Control type="input" maxLength={35}
                          name="billItemText" value={this.state.billItemText} onChange={this.handleChange}/>
                          :
                          <Form.Control as="select" name="billItem" 
                          onChange={this.handleBillItemChange}
                          value={this.state.billItemId}>
                            <option value=''></option>
                            {this.getBillItems()}
                          </Form.Control>
                        }
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                  <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                      <Form.Control type="number"
                      name="amount" 
                      value={Number(this.state.amount).toFixed(this.props.billInfo.currencyDecimalPlace)}
                      onChange={this.handleChange}/>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">{this.props.billInfo.billCurrency}</InputGroup.Text>
                      </InputGroup.Prepend>
                    </InputGroup>
                  </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number"
                      name="quantity" value={Number(this.state.quantity).toFixed(0)}
                      onChange={this.handleChange}/>
                  </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                  <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control as="select" name="type" 
                    onChange={this.handleChange}
                    value={this.state.type}>
                      <option value=''></option>
                      <option value='Credit'>Credit</option>
                      <option value='Debit'>Debit</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
            </Row>
            <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleBillItemChange = (event) => {
    const billItemName = event.target[event.target.selectedIndex].getAttribute('name');
    this.setState({
      billItemId: event.target.value,
      billItemName
    })
  }

  getBillItems = () => {
      if(this.props.billInfo && this.props.billInfo.billItems){
      return this.props.billInfo.billItems.map( 
          billItem => 
          <option key={billItem.billItemId} value={billItem.billItemId} name={billItem.billItemName}>
            {billItem.billItemName}
          </option>
        );
      } else {
          return null;
      }
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    });

    if(event.target.name === 'itemType' && event.target.value === 'FREE'){
      this.setState({
        billItemId:0, billItemName: ''
      })
    } else if(event.target.name === 'itemType' && event.target.value === 'REF'){
      this.setState({
        billItemText: ''
      })
    }
  }

  handleClick = () => {
    if(!this.state.billItemId && this.state.itemType==='REF'){
      this.setState({message: 'Invalid bill Item, should not be empty'});
      return;
    } else if(!this.state.billItemText && this.state.itemType==='FREE'){
      this.setState({message: 'Invalid bill Item, should not be empty'});
      return;
    } else if (!this.state.amount) {
      this.setState({message: 'Invalid amount, should not be zero'});
      return;
    } else if(!this.state.quantity) {
      this.setState({message: 'Invalid quantity, should not be zero'});
      return; 
    } else if(!this.state.type) {
      this.setState({message: 'Invalid type, should not be empty'});
      return;
    }

    if (typeof this.props.onEdit=== 'function') {
        this.props.onEdit(this.state.billItemIndex, this.state.itemType,
          Number(this.state.billItemId), this.state.billItemName,
          this.state.billItemText, 
          this.state.amount, this.state.quantity, this.state.type);
    }
    this.props.onHide();
  }//End of handle Click
}

export default EditBillTransDetailModal;
