import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import AccountBalanceAsOfDate from './AccountBalanceAsOfDate';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
    accountId: '',
    balanceDate: '',
  }

class AccountBalanceAsOfDateList extends Component {
    state = {
        balance: 0,
        currency: '',
        currencyDecimalPlace: 0,
        returnedBalanceDate: '',
        ...initialState,
    }

    render() {
        return (
            <React.Fragment>
                <FormContainer title="Account Balance As Of Date">
                    <Form>
                    <Row>
                        <Col>
                            <Form.Control as="select" size="sm" name="accountId" 
                                onChange={this.handleChange}
                                value={this.state.accountId}>
                                <option value=''>Accounts</option>
                                <AccountsDropDown />
                            </Form.Control>
                        </Col>
                        <Col>
                            <DatePickerInput value={this.state.balanceDate}
                            onChange={this.handleBalanceDateChange} readOnly 
                            placeholder="Balance Date" small/>
                        </Col>
                        <Col xs={1}>
                            <Button variant="primary" size="sm" block 
                            onClick={this.handleListClick} disabled={!this.isFilled}>List</Button>
                        </Col>
                    </Row>
                    </Form>    
                </FormContainer>
                <FormContainer>
                    {
                        this.state.currency &&
                        <AccountBalanceAsOfDate balance={this.state.balance} 
                        currency={this.state.currency} balanceDate={this.state.returnedBalanceDate} 
                        currencyDecimalPlace={this.state.currencyDecimalPlace}/>
                    }
                </FormContainer>
            </React.Fragment>
        )
    }

    handleBalanceDateChange = (jsDate, date) => {
        this.setState({
            balanceDate: date
        });
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : 
            event.target.value)
        })
    }

    isFilled = () => {
        return (this.state.accountId && this.statebalanceDate);
    }

    handleListClick = () => {
        TransactionRequest.getAccountBalanceAsOfDate(this.state.accountId, this.state.balanceDate)
        .then( res => {
            console.log(res);
            this.setState({
                balance: res.balance,
                currency: res.currency,
                currencyDecimalPlace: res.currencyDecimalPlace,
                returnedBalanceDate: res.balanceDate
            })
        });
    }
}

export default AccountBalanceAsOfDateList;