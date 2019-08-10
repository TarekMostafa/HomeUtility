import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import WealthTransactionTable from '../transactions/WealthTransactionTable';

import RelatedTransactionRequest from '../../../axios/RelatedTransactionRequest';

const initialState = {
  type: '',
  description: '',
  transactions: []
}

class RelatedTransactionDetails extends Component {

  state = {
    ...initialState,
  }

  loadRelatedTransactionsDetails(id){
    RelatedTransactionRequest.getRelatedTransactionsDetails(id)
    .then( relatedTransactionsDetails => {
      console.log(relatedTransactionsDetails);
      this.setState({
        type: relatedTransactionsDetails.relatedTransaction.relatedTransactionType,
        description: relatedTransactionsDetails.relatedTransaction.relatedTransactionDesc,
        transactions: relatedTransactionsDetails.transactions
      });
    });
  }

  componentDidMount() {
    this.loadRelatedTransactionsDetails(this.props.match.params.id);
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Account Related Transactions Details">
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="id">
                <Form.Label>Id</Form.Label>
                <Form.Control type="input"
                name="id" value={this.props.match.params.id} readOnly/>
              </Form.Group>
              <Form.Group as={Col} controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control type="input"
                name="type" value={this.state.type} readOnly/>
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="input"
              name="description" value={this.state.description} readOnly/>
            </Form.Group>
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
