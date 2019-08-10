import React, { Component } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

import RelatedTransactionTable from './RelatedTransactionTable';
import RelatedTypesDropDown from './RelatedTypesDropDown';
import FormContainer from '../../common/FormContainer';

import RelatedTransactionRequest from '../../../axios/RelatedTransactionRequest';

const initialState = {
  type: '',
  description: '',
  limit: 10,
  id: '',
  includeDescription: true,
}

class RelatedTransactionList extends Component {

  state = {
    relatedTransactions: [],
    appearMoreButton: true,
    ...initialState,
  }

  loadTransctions(append) {
    RelatedTransactionRequest.getRelatedTransactions(this.state.limit,
      (append?this.state.relatedTransactions.length:0), this.state.type,
      this.state.description, this.state.id, this.state.includeDescription)
    .then( (relatedTransactions) => {
      let _relatedTransactions = [];
      if(append) {
        _relatedTransactions = [...this.state.relatedTransactions, ...relatedTransactions];
      } else {
        _relatedTransactions = [...relatedTransactions];
      }
      this.setState({
        relatedTransactions: _relatedTransactions,
        appearMoreButton: (relatedTransactions.length >= this.state.limit)
      });
    });
  }

  componentDidMount() {
    this.loadTransctions(false);
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts Related Transactions">
          <Form>
          <Row>
            <Col xs={3}>
              <Form.Control as="select" size="sm" name="type" onChange={this.handleChange}
                value={this.state.type}>
                <option value=''>Related Types</option>
                <RelatedTypesDropDown />
              </Form.Control>
            </Col>
            <Col xs={5}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox name="includeDescription"
                  checked={this.state.includeDescription} onChange={this.handleChange}/>
                </InputGroup.Prepend>
                <Form.Control type="input" placeholder="description" size="sm" name="description"
                onChange={this.handleChange} value={this.state.description}/>
              </InputGroup>
            </Col>
            <Col xs={1}>
              <Form.Control as="select" size="sm" name="limit" onChange={this.handleChange}
                value={this.state.limit}>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Form.Control>
            </Col>
            <Col xs={1}>
              <Form.Control type="number" placeholder="Id" size="sm" name="id"
              onChange={this.handleChange} value={this.state.id}/>
            </Col>
            <Col xs={1}>
              <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
            </Col>
            <Col xs={1}>
              <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
            </Col>
          </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <RelatedTransactionTable relatedTransactions={this.state.relatedTransactions}
          onDetails={this.handleDetails}/>
          <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
            hidden={!this.state.appearMoreButton}>
            more...</Button>
        </FormContainer>
      </React.Fragment>
    )
  }// end of render

  handleListClick = () => {
    this.loadTransctions(false);
  }

  handleMoreClick = () => {
    this.loadTransctions(true);
  }

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
    })
  }

  handleDetails = (id) => {
    this.props.history.push('relatedtransactiondetails/'+id)
  }

}

export default RelatedTransactionList;
