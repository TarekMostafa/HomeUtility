import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ModalContainer from '../../common/ModalContainer';
import BillItemsTable from './BillItemsTable';

import BillRequest from '../../../axios/BillRequest'

const initialState = {
  itemName: '',
  billItems: [],
  message: '',
  isLoading: false,
}

class EditBillItemsModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    this.setState({billItems: this.props.billItems});
  }

  render () {
    return (
      <ModalContainer title={"Edit Bill Items (Id=" + this.props.billId + ")"} show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'OK'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="itemName">
            <Form.Label>Name</Form.Label>
            <Row>
              <Col xs={9}>
                <Form.Control type="input" maxLength={35}
                name="itemName" value={this.state.itemName} onChange={this.handleChange}/>
              </Col>
              <Col xs={3}>
              <Button variant="primary" size="sm" onClick={this.handleItemAdd}>
                Add Item
              </Button>
              </Col>
            </Row>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
        <BillItemsTable billItems={this.state.billItems} onItemChange={this.handleItemChange} 
        onItemDelete={this.handleItemDelete}/>
      </ModalContainer>
    )
  }//end of render

  handleItemChange = (index, event) => {
    let billItems = [...this.state.billItems];
    billItems[index].billItemName = event.target.value;

    this.setState({
      billItems
    })
  }

  handleItemAdd = () => {
    const index = this.state.billItems.findIndex(
      item => item.billItemName.trim() === this.state.itemName.trim());
    if(index >= 0){
      this.setState({message: 'This item is already exist'});
    } else {
      // add bill Item
      let billItems = [];
      billItems.push({billItemName: this.state.itemName, billItemId: 0});
      billItems = [...billItems, ...this.state.billItems];

      this.setState({
        billItems,
        itemName: ''
      })
    }
  }

  handleItemDelete = (index, billItemId) => {
    BillRequest.getCountOfBillItemUsed(billItemId)
    .then( count => {
      const countNum = Number(count);
      if(countNum > 0) {
        this.setState({message: 'This item cannot be deleted as it used (' + count + ') times'})
      } else {
        // delete bill item
        let billItems = [...this.state.billItems];
        billItems.splice(index, 1);

        this.setState({
          billItems
        });
      }
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading bill Item count information' + err});
    })
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
    this.props.onOkClick(this.state.billItems);
    this.props.onHide();
  }

}

EditBillItemsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  billId: PropTypes.number,
  billItems: PropTypes.array,
  onOkClick: PropTypes.func,
};

EditBillItemsModal.defaultProps = {
  show: false,
  onHide: () => {},
  billId: 0,
  billItems: [],
  onOkClick: () => {},
}

export default EditBillItemsModal;
