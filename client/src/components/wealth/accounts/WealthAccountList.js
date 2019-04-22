import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import WealthAccountTable from './WealthAccountTable';
import WealthAccountTotalBalance from './WealthAccountTotalBalance';
import AddNewAccountModal from './AddNewAccountModal';
import EditAccountModal from './EditAccountModal';
import DeleteAccountModal from './DeleteAccountModal';
import FormContainer from '../../common/FormContainer';
import BanksDropDown from '../banks/BanksDropDown';
import AccountStatusesDropDown from './AccountStatusesDropDown';

import AccountRequest from '../../../axios/AccountRequest';

const initialState = {
  accountStatus: 'ACTIVE',
  accountBank: '',
}

class WealthAccountList extends Component {
  state = {
    accounts: [],
    modalAddShow: false,
    modalEditShow: false,
    modalDeleteShow: false,
    accountId: '',
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
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddNewAccount}>Add New Account</Button>
        }>
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="accountBank" onChange={this.handleChange}
                  value={this.state.accountBank}>
                  <option value=''>Banks</option>
                  <BanksDropDown />
                </Form.Control>
              </Col>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="accountStatus" onChange={this.handleChange}
                  value={this.state.accountStatus}>
                  <option value=''>Account Statuses</option>
                  <AccountStatusesDropDown />
                </Form.Control>
              </Col>
              <Col xs={{offset:4, span:1}}>
                <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
              </Col>
              <Col xs={1}>
                <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <WealthAccountTable accounts={this.state.accounts} onEditAccount={this.handleEditAccount}
          onDeleteAccount={this.handleDeleteAccount}/>
          <Row>
            <Col xs={{offset:4, span:4}}>
              {this.props.appSettings &&
              <WealthAccountTotalBalance accounts={this.state.accounts}
              baseCurrency={this.props.appSettings.baseCurrency}
              decimalPlace={this.props.appSettings.currency.currencyDecimalPlace}/>}
            </Col>
          </Row>
        </FormContainer>
        <AddNewAccountModal show={this.state.modalAddShow} onHide={() => this.handleHide('ADD')}
        onSave={this.handleListClick}/>
        {
          this.state.modalEditShow &&
          <EditAccountModal show={this.state.modalEditShow} onHide={() => this.handleHide('EDIT')}
          onSave={this.handleListClick} accountId={this.state.accountId}/>
        }
        {
          this.state.modalDeleteShow &&
          <DeleteAccountModal show={this.state.modalDeleteShow} onHide={() => this.handleHide('DELETE')}
          onDelete={this.handleListClick} accountId={this.state.accountId}/>
        }
      </React.Fragment>
    )
  }//end of render

  handleAddNewAccount = () => {
    this.setState({modalAddShow: true});
  }

  handleEditAccount = (accountId) => {
    this.setState({
      modalEditShow: true,
      accountId
    });
  }

  handleDeleteAccount = (accountId) => {
    this.setState({
      modalDeleteShow: true,
      accountId
    });
  }

  handleHide = (type) => {
    switch(type) {
      case 'ADD':
        this.setState({modalAddShow: false});
        break;
      case 'EDIT':
        this.setState({modalEditShow: false});
        break;
      case 'DELETE':
        this.setState({modalDeleteShow: false});
        break;
      default:
        break;
    }
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

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings,
	}
}

export default connect(mapStateToProps)(WealthAccountList);
