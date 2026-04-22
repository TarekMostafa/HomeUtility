import React, { Component } from 'react';

import FormContainer from '../../common/FormContainer';
import ModalContainer from '../../common/ModalContainer';
import BillTransactionTable from './BillTransactionTable';
import BillTransactionSimpleSearch from './BillTransactionSimpleSearch';

import BillTransactionRequest from '../../../axios/BillTransactionRequest';

const initialState = {
  postingDateFrom: '', 
  postingDateTo: '',
  notes:'',
  includeNotes: false,
  limit: 99,
}

class BillTransactionListModal extends Component {
  state = {
    bill: '', 
    amountType: '',
    transactions: [],
    ...initialState,
  }

  loadTransactions() {
    BillTransactionRequest.getBillsTransactions(this.state.limit, 
      0, this.state.bill, '', '', 
      this.state.postingDateFrom, this.state.postingDateTo, 
      this.state.includeNotes, this.state.notes, this.state.amountType, false)
    .then( (billsTrans) => {
      let transactions = [...billsTrans];
      this.setState({
        transactions
      })
    })
  }

  componentDidMount(props) {
    this.setState({
      bill: this.props.bill,
      amountType: this.props.amountType,
    }, () => {
      this.loadTransactions(false);
    })
  }

  render() {
    return (
      <ModalContainer title="Search Bill Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow} size='xl'>
        <FormContainer>
          <BillTransactionSimpleSearch billId={this.state.bill} onListClick={this.handleListClick} 
            onResetClick={this.handleResetClick}/>
        </FormContainer>
        <FormContainer>
          <BillTransactionTable transactions={this.state.transactions}
            selectable={true}
            onSelectBillTransaction={this.handleSelectBillTrans}/>
        </FormContainer>
      </ModalContainer>
    )
  }//end of render

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleListClick = (postingDateFrom, postingDateTo, 
    includeNotes, notes, limit) => {
    this.setState({
      postingDateFrom, postingDateTo, includeNotes, notes, limit
    }, () => {
      this.loadTransactions(false);
    });
  }

  handleSelectBillTrans = (transId) => {
    if (typeof this.props.onSelect=== 'function') {
      this.props.onSelect(transId);
    }
  }
}

export default BillTransactionListModal;
