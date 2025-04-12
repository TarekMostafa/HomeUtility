import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ModalContainer from '../../common/ModalContainer';
import TransactionRequest from '../../../axios/TransactionRequest';
import AddTransactionLabels from './AddTransactionLabels';
import ViewSingleTransactionData from './ViewSingleTransactionData';
// import amountFormatter from '../../../utilities/amountFormatter';

const initialState = {
  account: '',
  postingDate: '',
  amount: '0',
  crdr: 0,
  type: '',
  narrative: '',
  accountCurrencyDecimalPlaces: 0,
  currency: '',
  message: '',
  isLoading: false,
  isLabelActivated: false,
  labels: null,
}

class ViewSingleTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transactionId)
      return;
    TransactionRequest.getSingleTransaction(this.props.transactionId)
    .then( (transaction) => {
      this.setState({
        account: transaction.transactionAccount,
        postingDate: transaction.transactionPostingDate,
        amount: transaction.transactionAmountFormatted,
        crdr: transaction.transactionCRDR,
        type: transaction.transactionTypeId,
        narrative: transaction.transactionNarrative,
        accountCurrencyDecimalPlaces: transaction.currencyDecimalPlace,
        currency: transaction.accountCurrency,
        isLabelActivated: transaction.isLabelActivated,
        labels: transaction.labels,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="View Single Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
          {
            this.state.isLabelActivated? 
            <Tabs defaultActiveKey="main">
              <Tab eventKey="main" title="Transaction">
                <ViewSingleTransactionData data={this.state}/>
              </Tab>
              <Tab eventKey="labels" title="Labels">
                <AddTransactionLabels transactionId={this.props.transactionId} labels={this.state.labels}/>
              </Tab>
            </Tabs>
            :
            <ViewSingleTransactionData data={this.state}/>
          }
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }
}

export default ViewSingleTransactionModal;
