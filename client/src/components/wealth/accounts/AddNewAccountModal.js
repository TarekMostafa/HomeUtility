import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../../common/ModalContainer';
import BanksDropDown from '../banks/BanksDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import AccountRequest from '../../../axios/AccountRequest';
import { getAccounts } from '../../../store/actions/lookupsAction';

const initialState = {
  accountBank: '',
  accountNumber: '',
  accountCurrency: '',
  accountStartBalance: 0,
  message: '',
  isLoading: false,
}

class AddNewAccountModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Add New Account" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Create'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="accountBank">
            <Form.Label>Account Bank</Form.Label>
            <Form.Control as="select" name="accountBank" onChange={this.handleChange}>
              <option value=''></option>
              <BanksDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control type="input" maxLength={20}
            name="accountNumber" value={this.state.accountNumber} onChange={this.handleChange}/>
          </Form.Group>
          <Form.Group controlId="accountCurrency">
            <Form.Label>Account Currency</Form.Label>
            <Form.Control as="select" name="accountCurrency" onChange={this.handleChange}>
              <option value=''></option>
              <CurrenciesDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountStartBalance">
            <Form.Label>Start Balance</Form.Label>
            <Form.Control type="number" maxLength={20}
            name="accountStartBalance" value={this.state.accountStartBalance} onChange={this.handleChange}/>
          </Form.Group>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

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

  handleClick = () => {
    // Validate Input
    if(this.state.accountBank === '') {
      this.setState({message: 'Invalid account bank, should not be empty'});
      return;
    } else if(this.state.accountNumber === '') {
      this.setState({message: 'Invalid account number, should not be empty'});
      return;
    } else if(this.state.accountCurrency === '') {
      this.setState({message: 'Invalid account currency, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Add new account
    AccountRequest.addNewAccount(this.state.accountBank, this.state.accountNumber,
    this.state.accountCurrency, this.state.accountStartBalance, this.props.user.userId)
    .then( (response) => {
      if (typeof this.props.onSave=== 'function') {
        this.props.onSave();
      }
      this.setState({isLoading: false});
      this.props.getAccounts();
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

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAccounts: () => dispatch(getAccounts()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewAccountModal);
