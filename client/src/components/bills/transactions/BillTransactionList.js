import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import BillTransactionTable from './BillTransactionTable';
import BillTransactionSearch from './BillTransactionSearch';
import AddBillTransactionModal from './AddBillTransactionModal';
import ViewBillTransactionModal from './ViewBillTransactionModal';
import EditBillTransactionModal from './EditBillTransactionModal';
import DeleteBillTransactionModal from './DeleteBillTransactionModal';

import BillTransactionRequest from '../../../axios/BillTransactionRequest';

const initialState = {
  bill: '',
  bDateFrom: '', 
  bDateTo: '', 
  postingDateFrom: '', 
  postingDateTo: '',
  notes:'',
  includeNotes: false,
  amountType: '',
  limit: 10,
}

class BillTransactionList extends Component {
  state = {
    transactions: [],
    modalAddShow: false,
    modalEditShow: false,
    modalViewShow: false,
    modalDeleteShow: false,
    transId: 0,
    appearMoreButton: true,
    ...initialState,
  }

  loadTransactions(append) {
    BillTransactionRequest.getBillsTransactions(this.state.limit, 
      (append?this.state.transactions.length:0), 
      this.state.bill, this.state.bDateFrom, this.state.bDateTo, 
      this.state.postingDateFrom, this.state.postingDateTo, this.state.includeNotes, 
      this.state.notes, this.state.amountType)
    .then( (billsTrans) => {
      let transactions = [];
      if(append) {
        transactions = [...this.state.transactions, ...billsTrans];
      } else {
        transactions = [...billsTrans];
      }
      this.setState({
        transactions,
        appearMoreButton: (billsTrans.length >= this.state.limit)
      })
    })
  }

  componentDidMount() {
    this.setState({
      bill: this.props.match.params.id
    }, () => {
      this.loadTransactions(false);
    })
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Bills Transactions" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddBillTrans}>Add Bill Transaction</Button>
        }>
          <BillTransactionSearch billId={this.state.bill} onListClick={this.handleListClick} 
            onResetClick={this.handleResetClick}/>
        </FormContainer>
        <FormContainer>
          <BillTransactionTable transactions={this.state.transactions}
          onViewBillTransaction={this.handleViewBillTrans}
          onEditBillTransaction={this.handleEditBillTrans}
          onDeleteBillTransaction={this.handleDeleteBillTrans}/>
          <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
            hidden={!this.state.appearMoreButton}>more...</Button>
        </FormContainer>
        <AddBillTransactionModal show={this.state.modalAddShow} onHide={this.handleHide}
        onSave={() => this.loadTransactions(false)}/>
        {
          this.state.modalViewShow && 
          <ViewBillTransactionModal show={this.state.modalViewShow} onHide={this.handleHide}
          transId={this.state.transId}/>
        }
        {
          this.state.modalEditShow && 
          <EditBillTransactionModal show={this.state.modalEditShow} onHide={this.handleHide}
          onEdit={() => this.loadTransactions(false)} transId={this.state.transId}/>
        }
        {
          this.state.modalDeleteShow && 
          <DeleteBillTransactionModal show={this.state.modalDeleteShow} onHide={this.handleHide}
          onDelete={() => this.loadTransactions(false)} transId={this.state.transId}/>
        }
      </React.Fragment>
    )
  }//end of render

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleListClick = (bill, bDateFrom, bDateTo, postingDateFrom, postingDateTo, 
    includeNotes, notes, amountType, limit) => {
    this.setState({
      bill, bDateFrom, bDateTo, postingDateFrom, postingDateTo, includeNotes, notes, amountType, limit
    }, () => {
      this.loadTransactions(false);
    });
  }

  handleHide = () => {
    this.setState({
      modalAddShow: false,
      modalEditShow: false,
      modalViewShow: false,
      modalDeleteShow: false
    });
  }

  handleAddBillTrans = () => {
    this.setState({modalAddShow: true});
  }

  handleEditBillTrans = (transId) => {
    this.setState({modalEditShow: true, transId});
  }

  handleViewBillTrans = (transId) => {
    this.setState({modalViewShow: true, transId});
  }

  handleDeleteBillTrans = (transId) => {
    this.setState({modalDeleteShow: true, transId});
  }

  handleMoreClick = () => {
    this.loadTransactions(true);
  }
}

export default BillTransactionList;
