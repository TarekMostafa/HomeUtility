import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import DebtorsDropDown from '../../debt/debtors/DebtorsDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';
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
  debtor: '',
  isLoading: false,
}

class LinkSingleToDebtorModal extends Component {
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
        currency: transaction.accountCurrency
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Link To Debtor" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="danger" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Link'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control as="select" name="account" readOnly
            value={this.state.account}>
              <option value=''></option>
              <AccountsDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="postingDate">
            <Form.Label>Posting Date</Form.Label>
            <Form.Control type="input"
            name="postingDate" value={moment(this.state.postingDate).format('DD/MM/YYYY')} readOnly/>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control type="input"
              name="amount"
              // value={amountFormatter(this.state.amount, this.state.accountCurrencyDecimalPlaces)}
              value={this.state.amount}
              readOnly/>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">{this.state.currency}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="crdr">
            <Row>
              <Col>
                <Form.Label>Credit/Debit</Form.Label>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Credit" value="Credit"
                name="crdr" readOnly checked={this.state.crdr==='Credit'}/>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Debit" value="Debit"
                name="crdr" readOnly checked={this.state.crdr==='Debit'}/>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" name="type" readOnly
            value={this.state.type}>
              <option value=''></option>
              <TransactionTypesDropDown typeCRDR={this.state.crdr}/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="narrative">
            <Form.Label>Narrative</Form.Label>
            <Form.Control type="input" maxLength={200}
            name="narrative" value={this.state.narrative} readOnly/>
          </Form.Group>
          <Form.Group controlId="debtor">
            <Form.Label>Debtor</Form.Label>
            <Form.Control as="select" name="debtor" onChange={this.handleChange} value={this.state.debtor}>
              <option value=''></option>
              <DebtorsDropDown currency={this.state.currency}/>
            </Form.Control>
          </Form.Group>
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleClick = () => {
    if(!this.state.debtor) {
        this.setState({message: 'Invalid debtor, should not be empty'});
        return;
    } else {
        this.setState({
          message: '',
          isLoading: true,
        });
    }
    // update single transaction
    TransactionRequest.linkToDebtor(this.props.transactionId, this.state.debtor)
    .then( (response) => {
      if (typeof this.props.onLink=== 'function') {
        this.props.onLink();
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

export default LinkSingleToDebtorModal;
