import React, { Component } from 'react';
import { Form, Button, Spinner, InputGroup, Row, Col } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ModalContainer from '../../common/ModalContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  accountFrom: '',
  typeFrom: '',
  postingDate: '',
  amountFrom: 0,
  amountTo: 0,
  accountTo: '',
  typeTo: '',
  decimalPlaces: 0,
  currencyFrom: '',
  currencyTo: '',
  rate: 0,
  message: '',
  isLoading: false,
}

class AddFXTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    TransactionRequest.getFXTransactionDefaults()
    .then(defaults => {
      this.setState({
        accountFrom: defaults.accountFrom,
        typeFrom: defaults.typeFrom,
        //postingDate: defaults.postingDate,
        amountFrom: defaults.amountFrom,
        amountTo: defaults.amountTo,
        accountTo: defaults.accountTo,
        typeTo: defaults.typeTo,
      })
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading default values'});
    })
  }

  render () {
    return (
      <ModalContainer title="Add FX Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add'
          }
          </Button>
        }>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="accountFrom">
                <Form.Label>Account From</Form.Label>
                <Form.Control as="select" name="accountFrom" onChange={this.handleAccountFromChange}
                value={this.state.accountFrom}>
                  <option value=''></option>
                  <AccountsDropDown status='ACTIVE'/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="accountTo">
                <Form.Label>Account To</Form.Label>
                <Form.Control as="select" name="accountTo" onChange={this.handleAccountToChange}
                value={this.state.accountTo}>
                  <option value=''></option>
                  <AccountsDropDown status='ACTIVE'/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="typeFrom">
                <Form.Label>Type From</Form.Label>
                <Form.Control as="select" name="typeFrom" onChange={this.handleChange}
                value={this.state.typeFrom}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Debit"/>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="typeTo">
                <Form.Label>Type To</Form.Label>
                <Form.Control as="select" name="typeTo" onChange={this.handleChange}
                value={this.state.typeTo}>
                  <option value=''></option>
                  <TransactionTypesDropDown typeCRDR="Credit"/>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="postingDate">
                <Form.Label>Posting Date</Form.Label>
                <DatePickerInput value={this.state.postingDate}
                onChange={this.handlePostingDateChange} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="rate">
                <Form.Label>Rate</Form.Label>
                <Form.Control type="number"
                  name="rate" value={Number(this.state.rate).toFixed(7)}
                  onChange={this.handleChange}/>
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
                  onChange={this.handleChange}/>
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
                  onChange={this.handleChange}/>
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

  handleAccountFromChange = (event) => {
    const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      accountFrom : event.target.value,
      decimalPlaces,
      currencyFrom: currency
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleAccountToChange = (event) => {
    const currency = event.target[event.target.selectedIndex].getAttribute('currency');
    this.setState({
      accountTo : event.target.value,
      currencyTo: currency
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handlePostingDateChange = (jsDate, date) => {
    this.setState({
      postingDate: date
    });
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.accountFrom) {
      this.setState({message: 'Invalid account from, should not be empty'});
      return;
    } else if(!this.state.accountTo) {
      this.setState({message: 'Invalid account to, should not be empty'});
      return;
    } else if(!this.state.typeFrom) {
      this.setState({message: 'Invalid type from, should not be empty'});
      return;
    } else if(!this.state.typeTo) {
      this.setState({message: 'Invalid type To, should not be empty'});
      return;
    } else if(!this.state.postingDate) {
      this.setState({message: 'Invalid posting date, should not be empty'});
      return;
    } else if(!this.state.rate) {
      this.setState({message: 'Invalid rate, should not be empty'});
      return;
    } else if(!this.state.amountFrom) {
      this.setState({message: 'Invalid amount from, should not be zero'});
      return;
    } else if(!this.state.amountTo) {
      this.setState({message: 'Invalid amount to, should not be zero'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add internal transaction
    TransactionRequest.addFXTransaction(this.state.accountFrom, this.state.accountTo, 
      this.state.typeFrom, this.state.typeTo, this.state.postingDate, this.state.rate, 
      this.state.amountFrom, this.state.amountTo)
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

export default AddFXTransactionModal;
