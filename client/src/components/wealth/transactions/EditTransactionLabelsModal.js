import React, { Component } from 'react';
import ModalContainer from '../../common/ModalContainer';
import TransactionRequest from '../../../axios/TransactionRequest';
import AddTransactionLabels from './AddTransactionLabels';

const initialState = {
  message: '',
  isLoading: false,
  isLabelActivated: false,
  labels: null,
}

class EditTransactionLabelsModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transactionId)
      return;
    TransactionRequest.getSingleTransaction(this.props.transactionId)
    .then( (transaction) => {
      this.setState({
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
      <ModalContainer title="Transaction Labels" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
          {
            <AddTransactionLabels transactionId={this.props.transactionId} 
              labels={this.state.labels} {...this.props}/>
          }
      </ModalContainer>
    );
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

}

export default EditTransactionLabelsModal;