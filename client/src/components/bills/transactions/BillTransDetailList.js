import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BillTransDetailTable from './BillTransDetailTable';
import AddBillTransDetailModal from './AddBillTransDetailModal';

import amountFormatter from '../../../utilities/amountFormatter';

import BillRequest from '../../../axios/BillRequest';

const initialState = {
    billInfo: null,
}

class BillTransDetailList extends Component {
    state = {
        modalAddShow: false,
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
                        currencyDecimalPlace={this.state.billInfo.currency.decimalPlaces} 
                        transDetails={this.props.transDetails} 
                        onRemove={this.props.onRemoveItem?this.handleRemoveItem:null}/>
                    </Col>
                </Row>
                {
                    this.state.modalAddShow &&
                    <AddBillTransDetailModal show={this.state.modalAddShow} onHide={this.handleHide}
                    billInfo={this.state.billInfo} onAdd={this.handleAddItem}/>
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
            this.state.billInfo.currency.decimalPlaces);
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

    handleRemoveItem = (index) => {
        this.props.onRemoveItem(index);
    }

    handleHide = () => {
        this.setState({modalAddShow: false});
    }

    handleAddItem = (billItem, amount, quantity, type) => {
        //Construct Object
        let transDetail = {
            detId: 0,
            detAmount: amount,
            detQuantity: quantity,
            detAmountType: type,
            billItem: billItem
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