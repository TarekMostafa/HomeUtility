import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
// import { connect } from 'react-redux';

import WealthDepositTable from './WealthDepositTable';
import WealthDepositTotal from './WealthDepositTotal';
import AddNewDepositModal from './AddNewDepositModal';
import DeleteDepositModal from './DeleteDepositModal';
import AddInterestModal from './AddInterestModal';
import ReleaseDepositModal from './ReleaseDepositModal';
import FormContainer from '../../common/FormContainer';
import BanksDropDown from '../banks/BanksDropDown';
import AccountStatusesDropDown from '../accounts/AccountStatusesDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import DepositViewModal from './DepositViewModal';

import DepositRequest from '../../../axios/DepositRequest';

const initialState = {
  depositStatus: 'ACTIVE',
  depositBank: '',
  depositCurrency: '',
}

class WealthDepositList extends Component {
  state = {
    deposits: [],
    formattedTotal: '0',
    baseCurrency: '',
    modalAddShow: false,
    modalDeleteShow: false,
    modalInterestShow: false,
    modalReleaseShow: false,
    modalViewShow: false,
    depositId: '',
    ...initialState,
  }

  loadDeposits() {
    DepositRequest.getDeposits(this.state.depositBank, this.state.depositStatus,
    this.state.depositCurrency)
    .then( (response) => {
      this.setState({
        deposits: response.deposits,
        formattedTotal: response.totalDepositsFormatted,
        baseCurrency: response.baseCurrencyCode
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
                <Form.Control as="select" size="sm" name="depositCurrency" onChange={this.handleChange}
                  value={this.state.depositCurrency}>
                  <option value=''>Currencies</option>
                  <CurrenciesDropDown />
                </Form.Control>
              </Col>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="depositStatus" onChange={this.handleChange}
                  value={this.state.depositStatus}>
                  <option value=''>Deposit Statuses</option>
                  <AccountStatusesDropDown />
                </Form.Control>
              </Col>
              <Col xs={{offset:1, span:1}}>
                <Button variant="primary" size="sm" block onClick={this.handleListClick}>List</Button>
              </Col>
              <Col xs={1}>
                <Button variant="secondary" size="sm" block onClick={this.handleResetClick}>Reset</Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <WealthDepositTable deposits={this.state.deposits}
          onDeleteDeposit={this.handleDeleteDeposit}
          onAddInterest={this.handleAddInterest}
          onReleaseDeposit={this.handleReleaseDeposit}
          onDepositDetails={this.handleDepositDetails}
          onViewDeposit={this.handleViewDeposit}/>
          <Row>
            <Col xs={{offset:4, span:4}}>
              {
              //this.props.appSettings && this.props.appSettings.baseCurrency &&
              //this.props.appSettings.currency &&
              <WealthDepositTotal deposits={this.state.deposits}
              //baseCurrency={this.props.appSettings.baseCurrency}
              //decimalPlace={this.props.appSettings.currency.currencyDecimalPlace}
              baseCurrency={this.state.baseCurrency}
              formattedTotal={this.state.formattedTotal}
              />
              }
            </Col>
          </Row>
        </FormContainer>
        <AddNewDepositModal show={this.state.modalAddShow} onHide={this.handleHide}
        onSave={this.handleListClick}/>
        {
          this.state.modalDeleteShow &&  <DeleteDepositModal
          show={this.state.modalDeleteShow} onHide={this.handleHide}
          onDelete={this.handleListClick} depositId={this.state.depositId}/>
        }
        {
          this.state.modalInterestShow && <AddInterestModal
          show={this.state.modalInterestShow} onHide={this.handleHide}
          depositId={this.state.depositId}/>
        }
        {
          this.state.modalReleaseShow && <ReleaseDepositModal
          show={this.state.modalReleaseShow} onHide={this.handleHide}
          onReleaseDeposit={this.handleListClick} depositId={this.state.depositId}/>
        }
        {
          this.state.modalViewShow && <DepositViewModal
          show={this.state.modalViewShow} onHide={this.handleHide}
          onViewDeposit={this.handleListClick} depositId={this.state.depositId}/>
        }
      </React.Fragment>
    )
  }//end of render

  handleAddNewAccount = () => {
    this.setState({modalAddShow: true});
  }

  handleDeleteDeposit = (depositId) => {
    this.setState({
      modalDeleteShow: true,
      depositId
    });
  }

  handleAddInterest = (depositId) => {
    this.setState({
      modalInterestShow: true,
      depositId
    });
  }

  handleReleaseDeposit = (depositId) => {
    this.setState({
      modalReleaseShow: true,
      depositId
    });
  }

  handleViewDeposit = (depositId) => {
    this.setState({
      modalViewShow: true,
      depositId
    })
  }

  handleDepositDetails = (deposit) => {
    this.props.history.push('relatedtransactiondetails/'+deposit.relatedId)
  }

  handleHide = () => {
    this.setState({
      modalAddShow: false,
      modalDeleteShow: false,
      modalInterestShow: false,
      modalReleaseShow: false,
      modalViewShow: false,
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

// const mapStateToProps = (state) => {
// 	return {
//     appSettings: state.lookups.appSettings,
// 	}
// }

//export default connect(mapStateToProps)(WealthDepositList);
export default WealthDepositList;