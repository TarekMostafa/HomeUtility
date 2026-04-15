import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BillTransDetailTable from './BillTransDetailTable';
import AddBillTransDetailModal from './AddBillTransDetailModal';
import EditBillTransDetailModal from './EditBillTransDetailModal';

import amountFormatter from '../../../utilities/amountFormatter';

import BillRequest from '../../../axios/BillRequest';

const initialState = {
    billInfo: null,
    selectedBillItem: null,
    selectedIndex: 0,
}

class BillTransDetailList extends Component {
    state = {
        modalAddShow: false,
        modalEditShow: false,
        ...initialState,
    }

    componentDidMount() {
        this.loadBillInfo(this.props.billId);
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

    render() {
        return(
            this.state.billInfo &&
            <React.Fragment>
                <Row>
                    <Col xs={5}><Form.Label>Items Details</Form.Label></Col>
                    <Col xs={4}>
                        <Form.Label>{this.calculateTotal()}</Form.Label>
                    </Col>
                    <Col xs={3}>
                        { this.props.onAddItem && <Button variant="info" size="sm" 
                            onClick={this.handleAddItemClick}>Add Item</Button>
                        }   
                    </Col>
                </Row>
                <Row>
                    <Col> 
                        <BillTransDetailTable 
                        currencyDecimalPlace={this.state.billInfo.currencyDecimalPlace} 
                        transDetails={this.props.transDetails} 
                        onRemove={this.props.onRemoveItem?this.handleRemoveItem:null}
                        onEdit={this.props.onEditItem?this.handleEditItemClick:null}/>
                    </Col>
                </Row>
                {
                    this.state.modalAddShow &&
                    <AddBillTransDetailModal show={this.state.modalAddShow} onHide={this.handleHide}
                    billInfo={this.state.billInfo} onAdd={this.handleAddItem}/>
                }
                {
                    this.state.modalEditShow &&
                    <EditBillTransDetailModal show={this.state.modalEditShow} onHide={this.handleHide}
                    billInfo={this.state.billInfo} selectedIndex={this.state.selectedIndex}
                    billItem={this.state.selectedBillItem} onEdit={this.handleEditItem}/>
                }
            </React.Fragment>
        )
    } // end of render

    calculateTotal = () => {
        let total = 0;
        this.props.transDetails.forEach( transDetail => {
            if(transDetail.detAmountType === 'Credit') {
                total += Number(transDetail.detAmount);
            } else {
                total -= transDetail.detAmount;
            }
        });
        const totalFormat = 'Total: ' + amountFormatter( Math.abs(total) , 
            this.state.billInfo.currencydecimalPlaces);
        if(total <0) {
            return totalFormat+' Debit';
        }else if (total >0) {
            return totalFormat+' Credit';
        } else {
            return totalFormat;
        }
    }

    handleAddItemClick = () => {
        this.setState({
          modalAddShow: true,
        });
    }

    handleEditItemClick = (index) => {
        this.setState({
            modalEditShow: true,
            selectedIndex: index,
            selectedBillItem: this.props.transDetails[index], 
        })
    }

    handleRemoveItem = (index) => {
        this.props.onRemoveItem(index);
    }

    handleEditItem = (index, itemType, billItemId, billItemName, billItemText,
        amount, quantity, type) => {
		//Construct Object
        let transDetail = {
            detAmount: amount,
            detQuantity: quantity,
            detAmountType: type,
            billItemId: (billItemId===0? null: billItemId),
            billItemName,
            detItemType: itemType,
            detItemText: billItemText,
        }

        this.props.onEditItem(index, transDetail);
    }

    handleHide = () => {
        this.setState({
            modalAddShow: false,
            modalEditShow: false,
        });
    }

    handleAddItem = (itemType, billItemId, billItemName, billItemText,
        amount, quantity, type) => {
        //Construct Object
        let transDetail = {
            detId: 0,
            detAmount: amount,
            detQuantity: quantity,
            detAmountType: type,
            billItemId: (billItemId===0? null: billItemId),
            billItemName,
            detItemType: itemType,
            detItemText: billItemText,
        }

        this.props.onAddItem(transDetail);
    }
}

BillTransDetailList.propTypes = {
    onAddItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
};
  
BillTransDetailList.defaultProps = {
}

export default BillTransDetailList;