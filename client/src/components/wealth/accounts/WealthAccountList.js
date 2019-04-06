import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import WealthAccountTable from './WealthAccountTable';
import FormContainer from '../../common/FormContainer';

import BankRequest from '../../../axios/BankRequest';
import AccountRequest from '../../../axios/AccountRequest';

const initialState = {
  accountStatus: '',
  accountBank: '',
}

class WealthAccountList extends Component {
  state = {
    accountStatuses: ['ACTIVE', 'CLOSED'],
    banks: [],
    accounts: [],
    ...initialState,
  }

  loadAccounts() {
    AccountRequest.getAccounts(this.state.accountBank, this.state.accountStatus)
    .then( (accounts) => {
      this.setState({
        accounts
      })
    })
  }

  componentDidMount() {
    this.loadAccounts();
    BankRequest.getBanks()
    .then( (banks) => {
      this.setState({
        banks
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts">
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="accountBank" onChange={this.handleChange}
                  value={this.state.accountBank}>
                  <option value=''>Banks</option>
                  { this.listBanks() }
                </Form.Control>
              </Col>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="accountStatus" onChange={this.handleChange}
                  value={this.state.accountStatus}>
                  <option value=''>Account Statuses</option>
                  { this.listAccountStatuses() }
                </Form.Control>
              </Col>
              <Col xs={{offset:4, span:1}}>
                <Button variant="primary" size="sm" onClick={this.handleListClick}>List</Button>
              </Col>
              <Col xs={1}>
                <Button variant="secondary" size="sm" onClick={this.handleResetClick}>Reset</Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <WealthAccountTable accounts={this.state.accounts}/>
      </React.Fragment>
    )
  }//end of render

  listAccountStatuses = () => {
    return this.state.accountStatuses && this.state.accountStatuses.map( (status) => {
      return (
        <option key={status} value={status}>{status}</option>
      )
    });
  }

  listBanks = () => {
    return this.state.banks && this.state.banks.map( (bank) => {
      return (
        <option key={bank.bankCode} value={bank.bankCode}>{bank.bankName}</option>
      )
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handleResetClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleListClick = () => {
    this.loadAccounts();
  }

}

export default WealthAccountList;
