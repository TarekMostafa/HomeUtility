import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import DepositRequest from '../../../axios/DepositRequest';
// import amountFormatter from '../../../utilities/amountFormatter';

const initialState = {
  depositReference: '',
  depositAccount: '',
  depositCurrency: '',
  depositAmount: '0',
  depositRate: 0,
  depositStartDate: '',
  depositEndDate: '',
  depositReleaseDate: '',
  depositStatus: '',
  depositCurrencyDecimalPlaces: 0,
  message: '',
  isLoading: false,
}

class DeleteDepositModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.depositId)
      return;
    DepositRequest.getDeposit(this.props.depositId)
    .then( (deposit) => {
      this.setState({
        depositReference: deposit.reference,
        depositAccount: deposit.accountNumber,
        depositCurrency: deposit.currencyCode,
        depositAmount: deposit.amountFormatted,
        depositRate: deposit.rate,
        depositStatus: deposit.status,
        depositStartDate: deposit.startDate,
        depositEndDate: deposit.endDate,
        depositReleaseDate: deposit.releaseDate,
        depositCurrencyDecimalPlaces: deposit.currencyDecimalPlace,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading deposit information'});
    })
  }

  render () {
    return (
      <ModalContainer title="View Deposit" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="depositReference">
                <Form.Label>Deposit Reference</Form.Label>
                <Form.Control type="input" name="depositReference"
                value={this.state.depositReference} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositAccount">
                <Form.Label>Withdrawn Account</Form.Label>
                <Form.Control type="input" name="depositAccount"
                value={this.state.depositAccount} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositAmount">
                <Form.Label>Deposit Amount</Form.Label>
                <Form.Control type="input" name="depositAmount"
                // value={amountFormatter(this.state.depositAmount, this.state.depositCurrencyDecimalPlaces)}
                value={this.state.depositAmount}
                readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositCurrency">
                <Form.Label>Deposit Currency</Form.Label>
                <Form.Control as="select" name="depositCurrency"
                value={this.state.depositCurrency} readOnly>
                  <option value=''></option>
                  <CurrenciesDropDown />
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositRate">
                <Form.Label>Deposit Rate</Form.Label>
                <Form.Control type="number" name="depositRate"
                value={Number(this.state.depositRate).toFixed(2)}
                readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositStatus">
                <Form.Label>Deposit Status</Form.Label>
                <Form.Control type="input" name="depositStatus"
                value={this.state.depositStatus} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="input"
                name="depositStartDate"
                value={moment(this.state.depositStartDate).format('DD/MM/YYYY')} readOnly/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="depositEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="input"
                name="depositEndDate"
                value={moment(this.state.depositEndDate).format('DD/MM/YYYY')} readOnly/>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="depositReleaseDate">
                <Form.Label>Release Date</Form.Label>
                <Form.Control type="input"
                name="depositReleaseDate"
                value={
                  this.state.depositReleaseDate?
                  moment(this.state.depositReleaseDate).format('DD/MM/YYYY'):''
                } readOnly/>
              </Form.Group>
            </Col>
            <Col>
            </Col>
          </Row>
          <Form.Text className='text-danger'>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }
}

export default DeleteDepositModal;
