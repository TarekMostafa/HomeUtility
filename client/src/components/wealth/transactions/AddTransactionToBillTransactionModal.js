import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ModalContainer from '../../common/ModalContainer';
import TransactionRequest from '../../../axios/TransactionRequest';
import ViewSingleTransactionData from './ViewSingleTransactionData';
import BillDropDown from '../../bills/summary/BillsDropDown';

const initialState = {
  bill: '',
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
}

class AddTransactionToBillTransactionModal extends Component {
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
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Add Transaction To Bill Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add to Bill Transaction'
          }
          </Button>
        }>
          {
            <React.Fragment>
              <Form>
                <Form.Group controlId="bills">
                  <Form.Label>Bill</Form.Label>
                  <Form.Control as="select" name="bill" onChange={this.handleChange}
                  value={this.state.bill}>
                    <option value=''></option>
                    <BillDropDown status="ACTIVE"/>
                  </Form.Control>
                </Form.Group>
              </Form>
              <ViewSingleTransactionData data={this.state}/>
            </React.Fragment>
          }
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    })
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.bill) {
      this.setState({message: 'Invalid bill, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    this.setState({
      message: '',
      isLoading: true,
    });
    // add transaction to bill transaction
    TransactionRequest.addTransactionToBillTransaction(
      this.props.transactionId, this.state.bill)
    .then( (response) => {
      if (typeof this.props.onSave=== 'function') {
        this.props.onSave();
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

export default AddTransactionToBillTransactionModal;
