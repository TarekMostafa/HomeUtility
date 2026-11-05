import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import AccountsDropDown from '../accounts/AccountsDropDown';
import AccountBalanceAsOfDate from './AccountBalanceAsOfDate';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
    accountId: '',
    currencyCode: '',
    balanceDate: '',
    dateType: 'POST',  //POST or VALUE
    balanceType: 'ACC',  //ACC or CCY 
  }

class AccountBalanceAsOfDateList extends Component {
    state = {
        balance: '0',
        currency: '',
        //currencyDecimalPlace: 0,
        returnedBalanceDate: '',
        ...initialState,
    }

    render() {
        return (
            <React.Fragment>
                <FormContainer title="Balance As Of Date">
                    <Form>
                    <Row>
                        <Col>
                        {
                            this.state.balanceType === 'ACC' ?
                            <Form.Control as="select" size="sm" name="accountId" 
                                onChange={this.handleChange}
                                value={this.state.accountId}>
                                <option value=''>Accounts</option>
                                <AccountsDropDown />
                            </Form.Control>
                            :
                            <Form.Control as="select" size="sm" name="currencyCode"
                                onChange={this.handleChange}
                                value={this.state.currencyCode}>
                                <option value=''>Currencies</option>
                                <CurrenciesDropDown />
                            </Form.Control>
                        }
                        </Col>
                        <Col>
                            <DatePickerInput value={this.state.balanceDate}
                            onChange={this.handleBalanceDateChange} readOnly 
                            placeholder="Balance Date" small/>
                        </Col>
                        <Col xs={1}>
                            <Button variant="primary" size="sm" block 
                            onClick={this.handleListClick} disabled={!this.isFilled()}>List</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span: 4, offset: 1}}>
                            <div>
                            <Form.Check inline type='radio' id={`default-radioAccount`} 
                                label={`Account`} checked={this.state.balanceType!=='CCY'} 
                                onChange={this.handleChange} name='balanceType' value='ACC'/>
                            <Form.Check inline type='radio' id={`default-radioCurrency`} 
                                label={`Currency`} checked={this.state.balanceType==='CCY'} 
                                onChange={this.handleChange} name='balanceType' value='CCY'/>
                            </div>
                        </Col>
                        <Col xs={{span: 4, offset: 1}}>
                            <div>
                            <Form.Check inline type='radio' id={`default-radioPosting`} 
                                label={`Posting Date`} checked={this.state.dateType!=='VALUE'} 
                                onChange={this.handleChange} name='dateType' value='POST'/>
                            <Form.Check inline type='radio' id={`default-radioValue`} 
                                label={`Value Date`} checked={this.state.dateType==='VALUE'} 
                                onChange={this.handleChange} name='dateType' value='VALUE'/>
                            </div>
                        </Col>
                    </Row>
                    </Form>    
                </FormContainer>
                <FormContainer>
                    {
                        this.state.currency &&
                        <AccountBalanceAsOfDate balance={this.state.balance} 
                        currency={this.state.currency} balanceDate={this.state.returnedBalanceDate} 
                        //currencyDecimalPlace={this.state.currencyDecimalPlace}/>
                        />
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
        if(this.state.balanceType==='ACC')
            return (this.state.accountId && this.state.balanceDate);
        else if(this.state.balanceType='CCY')
            return (this.state.currencyCode && this.state.balanceDate); 
        else
            return false;    
    }

    handleListClick = () => {
        TransactionRequest.getBalanceAsOfDate(
            (this.state.balanceType==='ACC'?this.state.accountId:null),
            (this.state.balanceType==='CCY'?this.state.currencyCode:null), 
            this.state.balanceDate, this.state.dateType)
        .then( res => {
            console.log(res);
            this.setState({
                balance: res.balanceFormatted,
                currency: res.currency,
                //currencyDecimalPlace: res.currencyDecimalPlace,
                returnedBalanceDate: res.balanceDate
            })
        });
    }
}

export default AccountBalanceAsOfDateList;