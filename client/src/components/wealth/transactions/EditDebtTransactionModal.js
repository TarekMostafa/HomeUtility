import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import DebtorsDropDown from '../../debt/debtors/DebtorsDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  account: '',
  postingDate: '',
  amount: 0,
  crdr: '',
  debtor: '',
  narrative: '',
  decimalPlaces: 0,
  currency: '',
  message: '',
  isLoading: false,
}

class EditDebtTransactionModal extends Component {
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
        amount: transaction.transactionAmount,
        crdr: transaction.transactionCRDR,
        debtor: transaction.transactionModuleId,
        narrative: transaction.transactionNarrative,
        decimalPlaces: transaction.currencyDecimalPlace,
        currency: transaction.accountCurrency
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Edit Debt Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Save'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control as="select" name="account" onChange={this.handleAccountChange}
            value={this.state.account}>
              <option value=''></option>
              <AccountsDropDown status='ACTIVE'/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="postingDate">
            <Form.Label>Posting Date</Form.Label>
            <DatePickerInput value={this.state.postingDate}
            onChange={this.handlePostingDateChange} readOnly/>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control type="number"
              name="amount" value={Number(this.state.amount).toFixed(this.state.decimalPlaces)}
              onChange={this.handleChange}/>
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
                <Form.Check inline type="radio" label="Credit" name="crdr" value="Credit" 
                onChange={this.handleChange} checked={this.state.crdr==='Credit'}/>
              </Col>
              <Col>
                <Form.Check inline type="radio" label="Debit" name="crdr"  value="Debit" 
                onChange={this.handleChange} checked={this.state.crdr==='Debit'}/>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="debtor">
            <Form.Label>Debtor</Form.Label>
            <Form.Control as="select" name="debtor" onChange={this.handleChange} value={this.state.debtor}>
              <option value=''></option>
              <DebtorsDropDown currency={this.state.currency}/>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="narrative">
            <Form.Label>Narrative</Form.Label>
            <Form.Control type="input" maxLength={200}
            name="narrative" value={this.state.narrative} onChange={this.handleChange}/>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleAccountChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      account : event.target.value,
      decimalPlaces,
      currency
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handlePostingDateChange = (jsDate, date) => {
    this.setState({
      postingDate: date
    });
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.account) {
      this.setState({message: 'Invalid account, should not be empty'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date, should not be empty'});
      return;
    } else if(!this.state.amount) {
      this.setState({message: 'Invalid amount, should not be zero'});
      return;
    } else if(!this.state.crdr) {
      this.setState({message: 'Invalid crdr, should not be empty'});
      return;
    } else if(!this.state.debtor) {
      this.setState({message: 'Invalid debtor, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add single transaction
    TransactionRequest.updateDebtTransaction(this.props.transactionId,
        this.state.account, this.state.postingDate,
        this.state.amount, this.state.crdr, this.state.debtor, this.state.narrative)
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

export default EditDebtTransactionModal;
