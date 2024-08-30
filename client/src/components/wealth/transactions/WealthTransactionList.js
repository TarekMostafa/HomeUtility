import React, { Component } from 'react';
import { Form, Row, Col, Button, ButtonToolbar, /*ButtonGroup,*/ InputGroup, 
  Dropdown, DropdownButton } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import WealthTransactionTable from './WealthTransactionTable';
import FormContainer from '../../common/FormContainer';
import TableLimiterDropDown from '../../common/TableLimiterDropDown';
import AccountsDropDown from '../accounts/AccountsDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import TransactionTypesDropDown from '../transactiontypes/TransactionTypesDropDown';
import AddSingleTransactionModal from './AddSingleTransactionModal';
import AddInternalTransactionModal from './AddInternalTransactionModal';
import EditSingleTransactionModal from './EditSingleTransactionModal';
import DeleteSingleTransactionModal from './DeleteSingleTransactionModal';
import MultiSelectDropDown from '../../common/MultiSelectDropDown';
import AddDebtTransactionModal from './AddDebtTransactionModal';
import EditDebtTransactionModal from './EditDebtTransactionModal';
import DeleteDebtTransactionModal from './DeleteDebtTransactionModal';
import ConvertSingleToDebtModal from './ConvertSingleToDebtModal';
import LinkSingleToDebtorModal from './LinkSingleToDebtorModal';
import AddFXTransactionModal from './AddFXTransactionModal';
import ReleaseDebtorModal from './ReleaseDebtorModal';
import ViewDebtTransactionModal from './ViewDebtTransactionModal';
import ViewSingleTransactionModal from './ViewSingleTransactionModal';
import ViewFXTransactionModal from './ViewFXTransactionModal';
import DeleteFXTransactionModal from './DeleteFXTransactionModal';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
  //account: '',
  //transactionType: '',
  postingDateFrom: '',
  postingDateTo: '',
  narrative: '',
  limit: 10,
  id: '',
  includeNarrative: true,
  transactionTypes: [],
  accounts: [],
  currencies: [],
}

class WealthTransactionList extends Component {

  state = {
    transactions: [],
    appearMoreButton: true,
    modalAddSingleShow: false,
    modalAddInternalShow: false,
    modalEditSingleShow: false,
    modalDeleteSingleShow: false,
    modalViewSingleShow: false,
    modalAddDebtShow: false,
    modalEditDebtShow: false,
    modalDeleteDebtShow: false,
    modalViewDebtShow: false,
    modalConvertToDebtShow: false,
    modalLinkToDebtShow: false,
    modalAddFXShow: false,
    modalReleaseDebtShow: false,
    modalViewFXShow: false,
    modalDeleteFXShow: false,
    transactionId: '',
    ...initialState,
  }

  loadTransctions(append) {
    TransactionRequest.getTransactions(this.state.limit,
      (append?this.state.transactions.length:0),
      this.state.accounts.map(acc=>acc.key), 
      this.state.transactionTypes.map(typ=>typ.key),
      this.state.postingDateFrom, this.state.postingDateTo,
      this.state.narrative, this.state.id, this.state.includeNarrative,
      this.state.currencies.map(ccy=>ccy.key))
    .then( (transactions) => {
      let _transactions = [];
      if(append) {
        _transactions = [...this.state.transactions, ...transactions];
      } else {
        _transactions = [...transactions];
      }
      this.setState({
        transactions: _transactions,
        appearMoreButton: (transactions.length >= this.state.limit)
      });
    });
  }

  componentDidMount() {
    this.loadTransctions(false);
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Accounts Transactions" toolbar={
          <ButtonToolbar aria-label="Toolbar with button groups">
            {/* <ButtonGroup className="mr-2" aria-label="First group">
              <Button variant="info" size="sm" onClick={this.handleAddSingleTransaction}>Add Single Transaction</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Second group">
              <Button variant="info" size="sm" onClick={this.handleAddInternalTransaction}>Add Internal Transaction</Button>
            </ButtonGroup> */}
            <DropdownButton variant="info" id="dropdown-basic-button" title="Actions"
              size="sm">
                <Dropdown.Item onClick={this.handleAddSingleTransaction}>
                  Add Single Transaction
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleAddInternalTransaction}>
                  Add Internal Transaction
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleAddDebtTransaction}>
                  Add Debt Transaction
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleAddFXTransaction}>
                  Add FX Transaction
                </Dropdown.Item>
            </DropdownButton>
          </ButtonToolbar>
        }>
          <Form>
          <Row>
            <Col>
              {/* <Form.Control as="select" size="sm" name="account" onChange={this.handleChange}
                value={this.state.account}>
                <option value=''>Accounts</option>
                <AccountsDropDown />
              </Form.Control> */}
              <MultiSelectDropDown labelSelect={"Accounts"} 
                selectedValues={this.state.accounts.map(acc=>acc.value)}>
                  <AccountsDropDown onSelect={this.handleAccounts} 
                  selectedData={this.state.accounts.map(acc=>acc.key)}/>
              </MultiSelectDropDown>
            </Col>
            <Col>
              {/* <Form.Control as="select" size="sm" name="transactionType"
                onChange={this.handleChange} value={this.state.transactionType}>
                <option value=''>Transaction Types</option>
                <TransactionTypesDropDown />
              </Form.Control> */}
              <MultiSelectDropDown labelSelect={"Transaction Types"} 
                selectedValues={this.state.transactionTypes.map(typ=>typ.value)}>
                  <TransactionTypesDropDown onSelect={this.handleTransactionTypes} 
                  selectedData={this.state.transactionTypes.map(typ=>typ.key)}/>
                </MultiSelectDropDown>
            </Col>
            <Col>
              <DatePickerInput value={this.state.postingDateFrom}
              onChange={this.handlePostingDateFromChange} readOnly placeholder="Posting Date From" small/>
            </Col>
            <Col>
              <DatePickerInput value={this.state.postingDateTo}
              onChange={this.handlePostingDateToChange} readOnly placeholder="Posting Date To" small/>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={3}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox name="includeNarrative"
                  checked={this.state.includeNarrative} onChange={this.handleChange}/>
                </InputGroup.Prepend>
                <Form.Control type="input" placeholder="Narrative" size="sm" name="narrative"
                onChange={this.handleChange} value={this.state.narrative}/>
              </InputGroup>
            </Col>
            <Col xs={3}>
              <MultiSelectDropDown labelSelect={"Currencies"} 
                selectedValues={this.state.currencies.map(ccy=>ccy.value)}>
                  <CurrenciesDropDown onSelect={this.handleCurrencies} 
                  selectedData={this.state.currencies.map(ccy=>ccy.key)}/>
              </MultiSelectDropDown>   
            </Col>
            <Col xs={2}>
              <Form.Control as="select" size="sm" name="limit" onChange={this.handleChange}
                value={this.state.limit}>
                <TableLimiterDropDown />
              </Form.Control>
            </Col>
            <Col xs={2}>
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
          <WealthTransactionTable transactions={this.state.transactions}
          onEditTransaction={this.handleEditTransaction}
          onDeleteTransaction={this.handleDeleteTransaction}
          onViewTransaction={this.handleViewTransaction}
          onRelatedTransaction={this.handleRelatedTransaction}
          onMigration={this.handleMigration}/>
          <Button variant="primary" size="sm" block onClick={this.handleMoreClick}
            hidden={!this.state.appearMoreButton}>
            more...</Button>
        </FormContainer>
        <AddSingleTransactionModal show={this.state.modalAddSingleShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        {
          this.state.modalAddInternalShow && 
          <AddInternalTransactionModal show={this.state.modalAddInternalShow} onHide={this.handleHide}
          onSave={this.handleListClick}/>
        }
        {
          this.state.modalEditSingleShow &&
          <EditSingleTransactionModal show={this.state.modalEditSingleShow} onHide={this.handleHide}
          onSave={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalDeleteSingleShow &&
          <DeleteSingleTransactionModal show={this.state.modalDeleteSingleShow} onHide={this.handleHide}
          onDelete={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalAddDebtShow &&
          <AddDebtTransactionModal show={this.state.modalAddDebtShow} onHide={this.handleHide}
          onSave={this.handleListClick} />
        }
        {
          this.state.modalEditDebtShow && 
          <EditDebtTransactionModal show={this.state.modalEditDebtShow} onHide={this.handleHide}
          onSave={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalDeleteDebtShow &&
          <DeleteDebtTransactionModal show={this.state.modalDeleteDebtShow} onHide={this.handleHide}
          onDelete={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalConvertToDebtShow && 
          <ConvertSingleToDebtModal show={this.state.modalConvertToDebtShow} onHide={this.handleHide}
          onConvert={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalLinkToDebtShow &&
          <LinkSingleToDebtorModal show={this.state.modalLinkToDebtShow} onHide={this.handleHide}
          onLink={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalAddFXShow &&
          <AddFXTransactionModal show={this.state.modalAddFXShow} onHide={this.handleHide}
          onSave={this.handleListClick} />
        }
        {
          this.state.modalReleaseDebtShow &&
          <ReleaseDebtorModal show={this.state.modalReleaseDebtShow} onHide={this.handleHide}
          onRelease={this.handleListClick} transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalViewSingleShow &&
          <ViewSingleTransactionModal show={this.state.modalViewSingleShow} onHide={this.handleHide}
          transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalViewDebtShow &&
          <ViewDebtTransactionModal show={this.state.modalViewDebtShow} onHide={this.handleHide}
          transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalViewFXShow &&
          <ViewFXTransactionModal show={this.state.modalViewFXShow} onHide={this.handleHide}
          transactionId={this.state.transactionId}/>
        }
        {
          this.state.modalDeleteFXShow && 
          <DeleteFXTransactionModal show={this.state.modalDeleteFXShow} onHide={this.handleHide}
          onDelete={this.handleListClick} transactionId={this.state.transactionId}/>
        }
      </React.Fragment>
    )
  }// end of render

  handleAccounts = (key, value) => {
    let _accounts = this.state.accounts;
    if(_accounts.some(acc=>acc.key === key)) {
      _accounts = _accounts.filter(acc=>acc.key!==key);
    } else {
      _accounts = [..._accounts, {key, value}];
    }
    this.setState({accounts: _accounts});
  }

  handleCurrencies = (key, value) => {
    let _currencies = this.state.currencies;
    if(_currencies.some(acc=>acc.key === key)) {
      _currencies = _currencies.filter(acc=>acc.key!==key);
    } else {
      _currencies = [..._currencies, {key, value}];
    }
    this.setState({currencies: _currencies});
  }

  handleTransactionTypes = (key, value) => {
    let _transactionTypes = this.state.transactionTypes;
    if(_transactionTypes.some(typ=>typ.key === key)) {
      _transactionTypes = _transactionTypes.filter(typ=>typ.key!==key);
    } else {
      _transactionTypes = [..._transactionTypes, {key, value}];
    }
    this.setState({transactionTypes: _transactionTypes});
  }

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

  handlePostingDateFromChange = (jsDate, date) => {
    this.setState({
      postingDateFrom: date
    });
  }

  handlePostingDateToChange = (jsDate, date) => {
    this.setState({
      postingDateTo: date
    });
  }

  handleAddSingleTransaction = () => {
    this.setState({
      modalAddSingleShow: true
    });
  }

  handleAddInternalTransaction = () => {
    this.setState({
      modalAddInternalShow: true
    });
  }

  handleAddDebtTransaction = () => {
    this.setState({
      modalAddDebtShow: true
    });
  }

  handleAddFXTransaction = () => {
    this.setState({
      modalAddFXShow: true
    });
  }

  handleHide = () => {
    this.setState({
      modalAddSingleShow: false,
      modalAddInternalShow: false,
      modalEditSingleShow: false,
      modalDeleteSingleShow: false,
      modalViewSingleShow: false,
      modalAddDebtShow: false,
      modalEditDebtShow: false,
      modalDeleteDebtShow: false,
      modalViewDebtShow: false,
      modalConvertToDebtShow: false,
      modalLinkToDebtShow: false,
      modalAddFXShow: false,
      modalReleaseDebtShow: false,
      modalViewFXShow: false,
      modalDeleteFXShow: false,
    });
  }

  handleEditTransaction = (transactionId, module) => {
    this.setState({
      modalEditSingleShow: (!module),
      modalEditDebtShow: (module==='DBT'),
      transactionId
    });
  }

  handleDeleteTransaction = (transactionId, module) => {
    this.setState({
      modalDeleteSingleShow: (!module),
      modalDeleteDebtShow: (module==='DBT'),
      modalDeleteFXShow: (module==='FX'),
      transactionId
    });
  }

  handleViewTransaction = (transactionId, module) => {
    this.setState({
      //modalViewSingleShow: (module!=='DBT'),
      modalViewSingleShow: !['DBT','FX'].includes(module),
      modalViewDebtShow: (module==='DBT'),
      modalViewFXShow: (module==='FX'),
      transactionId
    });
  }

  handleMigration = (transaction) => {
    if(transaction.migrationType === 'DBT_CNV'){
      this.setState({
        modalConvertToDebtShow: true,
        transactionId: transaction.transactionId
      });
    } else if(transaction.migrationType === 'DBT_LNK'){
      this.setState({
        modalLinkToDebtShow: true,
        transactionId: transaction.transactionId
      });
    } else if(transaction.migrationType === 'DBT_RLS'){
      this.setState({
        modalReleaseDebtShow: true,
        transactionId: transaction.transactionId
      });
    }
  }

  handleRelatedTransaction = (relatedId) => {
    this.props.history.push('relatedtransactiondetails/'+relatedId)
  }

}

export default WealthTransactionList;
