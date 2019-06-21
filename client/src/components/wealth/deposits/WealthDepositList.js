import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import WealthDepositTable from './WealthDepositTable';
import WealthDepositTotal from './WealthDepositTotal';
import AddNewDepositModal from './AddNewDepositModal';
import FormContainer from '../../common/FormContainer';
import BanksDropDown from '../banks/BanksDropDown';
import AccountStatusesDropDown from '../accounts/AccountStatusesDropDown';

import DepositRequest from '../../../axios/DepositRequest';

const initialState = {
  depositStatus: 'ACTIVE',
  depositBank: '',
}

class WealthDepositList extends Component {
  state = {
    deposits: [],
    modalAddShow: false,
    modalEditShow: false,
    modalDeleteShow: false,
    depositId: '',
    ...initialState,
  }

  loadDeposits() {
    DepositRequest.getDeposits(this.state.depositBank, this.state.depositStatus)
    .then( (deposits) => {
      this.setState({
        deposits
      })
    })
  }

  componentDidMount() {
    this.loadDeposits();
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Deposits Summary" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddNewAccount}>Create New Deposit</Button>
        }>
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="depositBank" onChange={this.handleChange}
                  value={this.state.depositBank}>
                  <option value=''>Banks</option>
                  <BanksDropDown />
                </Form.Control>
              </Col>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="depositStatus" onChange={this.handleChange}
                  value={this.state.depositStatus}>
                  <option value=''>Deposit Statuses</option>
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
          <WealthDepositTable deposits={this.state.deposits} onEditAccount={this.handleEditAccount}
          onDeleteAccount={this.handleDeleteAccount}/>
          <Row>
            <Col xs={{offset:4, span:4}}>
              {this.props.appSettings && this.props.appSettings.baseCurrency &&
              <WealthDepositTotal deposits={this.state.deposits}
              baseCurrency={this.props.appSettings.baseCurrency}
              decimalPlace={this.props.appSettings.currency.currencyDecimalPlace}/>}
            </Col>
          </Row>
        </FormContainer>
        <AddNewDepositModal show={this.state.modalAddShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
      </React.Fragment>
    )
  }//end of render

  handleAddNewAccount = () => {
    this.setState({modalAddShow: true});
  }

  handleEditAccount = (depositId) => {
    this.setState({
      modalEditShow: true,
      depositId
    });
  }

  handleDeleteAccount = (depositId) => {
    this.setState({
      modalDeleteShow: true,
      depositId
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
    this.loadDeposits();
  }

}

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings,
	}
}

export default connect(mapStateToProps)(WealthDepositList);
