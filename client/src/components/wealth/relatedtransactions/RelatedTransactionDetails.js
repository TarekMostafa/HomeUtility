import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import WealthTransactionTable from '../transactions/WealthTransactionTable';
import amountFormatter from '../../../utilities/amountFormatter';

import RelatedTransactionRequest from '../../../axios/RelatedTransactionRequest';

const initialState = {
  type: '',
  description: '',
  totalCredit: 0,
  totalDebit: 0,
  decimalPlaces: 0,
  transactions: []
}

class RelatedTransactionDetails extends Component {

  state = {
    ...initialState,
  }

  loadRelatedTransactionsDetails(id){
    RelatedTransactionRequest.getRelatedTransactionsDetails(id)
    .then( relatedTransactionsDetails => {
      this.calculateCreditAndDebit(relatedTransactionsDetails.transactions);
      this.setState({
        type: relatedTransactionsDetails.relatedTransaction.relatedTransactionType,
        description: relatedTransactionsDetails.relatedTransaction.relatedTransactionDesc,
        transactions: relatedTransactionsDetails.transactions
      });
    });
  }

  calculateCreditAndDebit(transactions) {
    let totalCredit = 0;
    let totalDebit = 0;
    let decimalPlaces = 0;

    transactions.forEach( (transaction, index) => {
      if(index === 0) {
        decimalPlaces = transaction.account.currency.currencyDecimalPlace;
      }
      if(transaction.transactionCRDR === "Debit") {
        totalDebit += transaction.transactionAmount;
      } else {
        totalCredit += transaction.transactionAmount;
      }
    });

    this.setState({totalDebit, totalCredit, decimalPlaces});
  }

  componentDidMount() {
    this.loadRelatedTransactionsDetails(this.props.match.params.id);
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title={"Account Related Transactions Details (Id=" + 
        this.props.match.params.id + ")"}>
          <Form>
            <Form.Row>
              <Form.Group as={Col} sm="4" controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control type="input"
                name="type" value={this.state.type} readOnly/>
              </Form.Group>
              <Form.Group as={Col} sm="8" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control type="input"
                name="description" value={this.state.description} readOnly/>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} sm="6" controlId="totalCredit">
                <Form.Label>Total Credit</Form.Label>
                <Form.Control type="input"
                name="totalCredit" readOnly
                value={amountFormatter(this.state.totalCredit, this.state.decimalPlaces)}/>
              </Form.Group>
              <Form.Group as={Col} sm="6" controlId="totalDebit">
                <Form.Label>Total Debit</Form.Label>
                <Form.Control type="input" 
                name="totalDebit" readOnly
                value={amountFormatter(this.state.totalDebit, this.state.decimalPlaces)}/>
              </Form.Group>
            </Form.Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <WealthTransactionTable transactions={this.state.transactions}/>
        </FormContainer>
      </React.Fragment>
    )
  }// end of render

}

export default RelatedTransactionDetails;
