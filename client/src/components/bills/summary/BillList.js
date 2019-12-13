import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import BillTable from './BillTable';
import BillStatusesDropDown from './BillStatusesDropDown';
import AddNewBillModal from './AddNewBillModal';
import ViewBillModal from './ViewBillModal';
import EditBillModal from './EditBillModal';
import DeleteBillModal from './DeleteBillModal';
import FormContainer from '../../common/FormContainer';

import BillRequest from '../../../axios/BillRequest';
import { getBills } from '../../../store/actions/lookupsAction';

const initialState = {
  billStatus: 'ACTIVE',
}

class BillList extends Component {
  state = {
    bills: [],
    modalAddShow: false,
    modalViewShow: false,
    modalDeleteShow: false,
    modalEditShow: false,
    billId: '',
    ...initialState,
  }

  loadBills() {
    BillRequest.getBills(this.state.billStatus)
    .then( (bills) => {
      this.setState({
        bills
      })
    })
  }

  componentDidMount() {
    this.loadBills();
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Bills Summary" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddNewBill}>Create New Bill</Button>
        }>
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="billStatus" onChange={this.handleChange}
                  value={this.state.billStatus}>
                  <option value=''>Bill Statuses</option>
                  <BillStatusesDropDown />
                </Form.Control>
              </Col>
              <Col xs={{offset:7, span:1}}>
                <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
              </Col>
              <Col xs={1}>
                <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <BillTable bills={this.state.bills} onViewBill={this.handleViewBill}
          onDeleteBill={this.handleDeleteBill} onEditBill={this.handleEditBill}
          onTransactions={this.handleTransactions}/>
        </FormContainer>
        <AddNewBillModal show={this.state.modalAddShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        {
          this.state.modalViewShow &&  <ViewBillModal
          show={this.state.modalViewShow} onHide={this.handleHide}
          billId={this.state.billId}/>
        }
        {
          this.state.modalEditShow && <EditBillModal
          show={this.state.modalEditShow} onHide={this.handleHide}
          billId={this.state.billId} onEdit={this.handleListClick}/>
        }
        {
          this.state.modalDeleteShow &&  <DeleteBillModal
          show={this.state.modalDeleteShow} onHide={this.handleHide}
          billId={this.state.billId} onDelete={this.handleListClick}/>
        }
      </React.Fragment>
    )
  }//end of render

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleListClick = () => {
    this.props.getBills();
    this.loadBills();
  }

  handleHide = () => {
    this.setState({
      modalAddShow: false,
      modalViewShow: false,
      modalDeleteShow: false,
      modalEditShow: false,
    });
  }

  handleAddNewBill = () => {
    this.setState({modalAddShow: true});
  }  

  handleViewBill = (billId) => {
    this.setState({modalViewShow: true, billId});
  }

  handleDeleteBill = (billId) => {
    this.setState({modalDeleteShow: true, billId});
  }

  handleEditBill = (billId) => {
    this.setState({modalEditShow: true, billId});
  }

  handleTransactions = (billId) => {
    this.props.history.push('/billstransactions/'+billId);
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBills: () => dispatch(getBills()),
  }
}

export default connect(null, mapDispatchToProps)(BillList);
