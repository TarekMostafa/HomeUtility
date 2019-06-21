import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import DepositRequest from '../../../axios/DepositRequest';
import amountFormatter from '../../../utilities/amountFormatter';

const initialState = {
  depositReference: '',
  depositAccount: '',
  depositCurrency: '',
  depositAmount: 0,
  depositRate: 0,
  depositStartDate: '',
  depositEndDate: '',
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
        depositAccount: deposit.account.accountNumber,
        depositCurrency: deposit.currencyCode,
        depositAmount: deposit.amount,
        depositRate: deposit.rate,
        depositStatus: deposit.status,
        depositStartDate: deposit.startDate,
        depositEndDate: deposit.endDate,
        depositCurrencyDecimalPlaces: deposit.currency.currencyDecimalPlace,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading deposit information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Delete Deposit" show={this.props.show}
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
                <Form.Control type="number" name="depositAmount"
                value={Number(this.state.depositAmount).toFixed(this.state.depositCurrencyDecimalPlaces)}
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

  handleClick = () => {
    this.setState({
      message: '',
      isLoading: true,
    });
    // Delete Deposit
    DepositRequest.deleteDeposit(this.props.depositId)
    .then( (response) => {
      if (typeof this.props.onDelete=== 'function') {
        this.props.onDelete();
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

export default DeleteDepositModal;