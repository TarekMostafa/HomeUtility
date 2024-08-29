import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
//import { connect } from 'react-redux';

import WealthAccountsContainer from './WealthAccountsContainer';
import WealthAccountTable from './WealthAccountTable';
import WealthAccountTotalBalance from './WealthAccountTotalBalance';
import AddNewAccountModal from './AddNewAccountModal';
import EditAccountModal from './EditAccountModal';
import DeleteAccountModal from './DeleteAccountModal';
import FormContainer from '../../common/FormContainer';
import BanksDropDown from '../banks/BanksDropDown';
import AccountStatusesDropDown from './AccountStatusesDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import MultiSelectDropDown from '../../common/MultiSelectDropDown';

import AccountRequest from '../../../axios/AccountRequest';

const initialState = {
  //accountStatus: 'ACTIVE',
  //accountBank: '',
  //accountCurrency: '',
  selectedBanks: [],
  selectedCurrencies: [],
  selectedStatuses: [{key:'ACTIVE',value:'ACTIVE'}]
}

class WealthAccountList extends Component {
  state = {
    accounts: [],
    formattedTotal: '0',
    baseCurrency: '',
    modalAddShow: false,
    modalEditShow: false,
    modalDeleteShow: false,
    accountId: '',
    view: 'Card',
    ...initialState,
  }

  loadAccounts() {
    AccountRequest.getAccounts(this.state.selectedBanks.map(bank=>bank.key), 
    this.state.selectedStatuses.map(sts=>sts.key),
    this.state.selectedCurrencies.map(ccy=>ccy.key))
    .then( (response) => {
      this.setState({
        accounts: response.accounts,
        formattedTotal: response.totalCurrentBalanceFormatted,
        baseCurrency: response.baseCurrencyCode
      })
    })
  }

  componentDidMount() {
    this.loadAccounts();
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts Summary" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddNewAccount}>Create New Account</Button>
        }>
          <Form>
            <Row>
              <Col xs={3}>
                {/* <Form.Control as="select" size="sm" name="accountBank" onChange={this.handleChange}
                  value={this.state.accountBank}>
                  <option value=''>Banks</option>
                  <BanksDropDown />
                </Form.Control> */}
                <MultiSelectDropDown labelSelect={"Banks"} 
                selectedValues={this.state.selectedBanks.map(bank=>bank.value)}>
                  <BanksDropDown  onSelect={this.handleBankSelect} 
                  selectedData={this.state.selectedBanks.map(bank=>bank.key)}/>
                </MultiSelectDropDown>
              </Col>
              <Col xs={3}>
                {/* <Form.Control as="select" size="sm" name="accountCurrency" onChange={this.handleChange}
                  value={this.state.accountCurrency}>
                  <option value=''>Currencies</option>
                  <CurrenciesDropDown />
                </Form.Control> */}
                <MultiSelectDropDown labelSelect={"Currencies"} 
                selectedValues={this.state.selectedCurrencies.map(ccy=>ccy.value)}>
                  <CurrenciesDropDown  onSelect={this.handleCurrencySelect} 
                  selectedData={this.state.selectedCurrencies.map(ccy=>ccy.key)}/>
                </MultiSelectDropDown>
              </Col>
              <Col xs={3}>
                {/* <Form.Control as="select" size="sm" name="accountStatus" onChange={this.handleChange}
                  value={this.state.accountStatus}>
                  <option value=''>Account Statuses</option>
                  <AccountStatusesDropDown />
                </Form.Control> */}
                <MultiSelectDropDown labelSelect={"Account Statuses"} 
                selectedValues={this.state.selectedStatuses.map(sts=>sts.value)}>
                  <AccountStatusesDropDown onSelect={this.handleStatusSelect} 
                  selectedData={this.state.selectedStatuses.map(sts=>sts.key)}/>
                </MultiSelectDropDown>
              </Col>
              {/* <Col xs={{offset:1, span:1}}> */}
              <Col xs={1}>
                <Form.Check 
                  type="switch"
                  id="view-switch"
                  label={this.state.view}
                  onChange={this.handleCheckChange}
                />
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
          {
            // this.props.appSettings && this.props.appSettings.baseCurrency &&
            // this.props.appSettings.currency &&
            <WealthAccountTotalBalance accounts={this.state.accounts}
              // baseCurrency={this.props.appSettings.baseCurrency}
              // decimalPlace={this.props.appSettings.currency.currencyDecimalPlace}/>
              baseCurrency={this.state.baseCurrency}
              formattedTotal={this.state.formattedTotal}/>
          }  
          {
            this.state.view === 'Card' ? 
            <WealthAccountsContainer accounts={this.state.accounts} onEditAccount={this.handleEditAccount}
              onDeleteAccount={this.handleDeleteAccount} baseCurrency={this.state.baseCurrency}/> :
            <WealthAccountTable accounts={this.state.accounts} onEditAccount={this.handleEditAccount}
            onDeleteAccount={this.handleDeleteAccount}/>
          }
        </FormContainer>
        <AddNewAccountModal show={this.state.modalAddShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        {
          this.state.modalEditShow &&
          <EditAccountModal show={this.state.modalEditShow} onHide={this.handleHide}
          onSave={this.handleListClick} accountId={this.state.accountId}/>
        }
        {
          this.state.modalDeleteShow &&
          <DeleteAccountModal show={this.state.modalDeleteShow} onHide={this.handleHide}
          onDelete={this.handleListClick} accountId={this.state.accountId}/>
        }
      </React.Fragment>
    )
  }//end of render

  handleBankSelect = (key, value) => {
    let _selectedBanks = this.state.selectedBanks;
    if(_selectedBanks.some(bank=>bank.key === key)) {
      _selectedBanks = _selectedBanks.filter(bank=>bank.key!==key);
    } else {
      _selectedBanks = [..._selectedBanks, {key, value}];
    }
    this.setState({selectedBanks: _selectedBanks});
  }

  handleCurrencySelect = (key, value) => {
    let _selectedCurrencies = this.state.selectedCurrencies;
    if(_selectedCurrencies.some(ccy=>ccy.key === key)) {
      _selectedCurrencies = _selectedCurrencies.filter(ccy=>ccy.key!==key);
    } else {
      _selectedCurrencies = [..._selectedCurrencies, {key, value}];
    }
    this.setState({selectedCurrencies: _selectedCurrencies});
  }

  handleStatusSelect = (key, value) => {
    let _selectedStatuses = this.state.selectedStatuses;
    if(_selectedStatuses.some(sts=>sts.key === key)) {
      _selectedStatuses = _selectedStatuses.filter(sts=>sts.key!==key);
    } else {
      _selectedStatuses = [..._selectedStatuses, {key, value}];
    }
    this.setState({selectedStatuses: _selectedStatuses});
  }

  handleAddNewAccount = () => {
    this.setState({modalAddShow: true});
  }

  handleEditAccount = (accountId) => {
    this.setState({
      modalEditShow: true,
      accountId
    });
  }

  handleCheckChange = () => {
    this.setState({
      view: (this.state.view === 'Card' ? 'Table' : 'Card')
    });
  }

  handleDeleteAccount = (accountId) => {
    this.setState({
      modalDeleteShow: true,
      accountId
    });
  }

  handleHide = () => {
    this.setState({
      modalAddShow: false,
      modalEditShow: false,
      modalDeleteShow: false
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

// const mapStateToProps = (state) => {
// 	return {
//     appSettings: state.lookups.appSettings,
// 	}
// }

//export default connect(mapStateToProps)(WealthAccountList);
export default WealthAccountList;