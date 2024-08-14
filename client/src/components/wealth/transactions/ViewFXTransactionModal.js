import React, { Component } from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  idFrom: 0,
  idTo: 0,
  accountFrom: '',
  typeFrom: '',
  postingDateFrom: '',
  postingDateTo: '',
  amountFrom: 0,
  amountTo: 0,
  accountTo: '',
  typeTo: '',
  decimalPlacesFrom: 0,
  decimalPlacesTo: 0,
  currencyFrom: '',
  currencyTo: '',
  rate: 0,
  message: '',
  isLoading: false,
}

class ViewFXTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transactionId)
        return;
    TransactionRequest.getFXTransaction(this.props.transactionId)
    .then(fxTransaction => {
      this.setState({
        idFrom: fxTransaction.fxFromId,
        idTo: fxTransaction.fxToId,
        accountFrom: fxTransaction.fxFromAccountId,
        typeFrom: fxTransaction.fxFromTypeId,
        postingDateFrom: fxTransaction.fxFromPostingDate,
        postingDateTo: fxTransaction.fxToPostingDate,
        amountFrom: fxTransaction.fxFromAmount,
        amountTo: fxTransaction.fxToAmount,
        accountTo: fxTransaction.fxToAccountId,
        typeTo: fxTransaction.fxToTypeId,
        currencyFrom: fxTransaction.fxFromCurrency,
        currencyTo: fxTransaction.fxToCurrency,
        decimalPlacesFrom: fxTransaction.fxFromCurrencyDecimal,
        decimalPlacesTo: fxTransaction.fxToCurrencyDecimal,
        rate: fxTransaction.fxRate
      })
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading FX transaction'});
    })
  }

  render () {
    return (
      <ModalContainer title="View FX Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="accountFrom">
                <Form.Label>Account From</Form.Label>
                <Form.Control as="select" name="accountFrom" readOnly
                value={this.state.accountFrom}>
                  <option value=''></option>
                  <AccountsDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="accountTo">
                <Form.Label>Account To</Form.Label>
                <Form.Control as="select" name="accountTo" readOnly
                value={this.state.accountTo}>
                  <option value=''></option>
                  <AccountsDropDown/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="typeFrom">
                <Form.Label>Type From</Form.Label>
                <Form.Control as="select" name="typeFrom" readOnly
                value={this.state.typeFrom}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Debit"/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="typeTo">
                <Form.Label>Type To</Form.Label>
                <Form.Control as="select" name="typeTo" readOnly
                value={this.state.typeTo}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Credit"/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="postingDateFrom">
                <Form.Label>Posting Date From</Form.Label>
                <Form.Control type="input" name="postingDateFrom"
                 value={moment(this.state.postingDateFrom).format('DD/MM/YYYY')}
                readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="postingDateTo">
                <Form.Label>Posting Date To</Form.Label>
                <Form.Control type="input" name="postingDateTo"
                value={moment(this.state.postingDateTo).format('DD/MM/YYYY')}
                readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="rate">
                <Form.Label>Rate</Form.Label>
                <Form.Control type="number"
                  name="rate" value={Number(this.state.rate).toFixed(7)}
                  readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="amountFrom">
                <Form.Label>Amount From</Form.Label>
                <InputGroup>
                  <Form.Control type="number"
                  name="amountFrom" value={Number(this.state.amountFrom).toFixed(this.state.decimalPlaces)}
                  readOnly/>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">{this.state.currencyFrom}</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="amountTo">
                <Form.Label>Amount To</Form.Label>
                <InputGroup>
                  <Form.Control type="number"
                  name="amountTo" value={Number(this.state.amountTo).toFixed(this.state.decimalPlaces)}
                  readOnly/>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">{this.state.currencyTo}</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

}

export default ViewFXTransactionModal;
