import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../../common/ModalContainer';
import BanksDropDown from '../banks/BanksDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from './AccountStatusesDropDown';
import AccountRequest from '../../../axios/AccountRequest';
import { getAccounts } from '../../../store/actions/lookupsAction';

const initialState = {
  accountBank: '',
  accountNumber: '',
  accountCurrency: '',
  accountStartBalance: 0,
  accountCurrentBalance: 0,
  accountStatus: '',
  accountLastBalanceUpdate: '',
  message: '',
  isLoading: false,
}

class DeleteAccountModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount(nextProps, prevState) {
    if(!this.props.accountId)
      return;
    AccountRequest.getAccount(this.props.accountId)
    .then( (account) => {
      this.setState({
        accountBank: account.accountBankCode,
        accountNumber: account.accountNumber,
        accountCurrency: account.acccountCurrency,
        accountStartBalance: account.accountStartBalance,
        accountStatus: account.accountStatus,
        accountCurrentBalance: account.accountCurrentBalance,
        accountLastBalanceUpdate: account.accountLastBalanceUpdate,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading account information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Delete Account" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="danger" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Delete'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="accountBank">
            <Form.Label>Account Bank</Form.Label>
            <Form.Control as="select" name="accountBank"
            value={this.state.accountBank} readOnly>
              <option value=''></option>
              <BanksDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control type="input" maxLength={20}
            name="accountNumber" value={this.state.accountNumber} readOnly/>
          </Form.Group>
          <Form.Group controlId="accountCurrency">
            <Form.Label>Account Currency</Form.Label>
            <Form.Control as="select" name="accountCurrency"
            value={this.state.accountCurrency} readOnly>
              <option value=''></option>
              <CurrenciesDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountStartBalance">
            <Form.Label>Start Balance</Form.Label>
            <Form.Control type="number"
            name="accountStartBalance" value={this.state.accountStartBalance} readOnly/>
          </Form.Group>
          <Form.Group controlId="accountCurrentBalance">
            <Form.Label>Current Balance</Form.Label>
            <Form.Control type="number"
            name="accountCurrentBalance" value={this.state.accountCurrentBalance} readOnly/>
          </Form.Group>
          <Form.Group controlId="accountStatus">
            <Form.Label>Account Status</Form.Label>
            <Form.Control as="select" name="accountStatus" readOnly
            value={this.state.accountStatus}>
              <option value=''></option>
              <AccountStatusesDropDown />
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountLastBalanceUpdate">
            <Form.Label>Balance Last Update</Form.Label>
            <Form.Control type="input"
            name="accountLastBalanceUpdate" value={this.state.accountLastBalanceUpdate} readOnly/>
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
    this.setState({
      message: '',
      isLoading: true,
    });
    // Add new account
    AccountRequest.deleteAccount(this.props.accountId)
    .then( (response) => {
      if (typeof this.props.onDelete=== 'function') {
        this.props.onDelete();
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

const mapDispatchToProps = (dispatch) => {
  return {
    getAccounts: () => dispatch(getAccounts()),
  }
}

export default connect(null, mapDispatchToProps)(DeleteAccountModal);
