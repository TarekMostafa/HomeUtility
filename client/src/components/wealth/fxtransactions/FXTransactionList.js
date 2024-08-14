import React, {useState} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import FXTransactionTable from './FXTransactionTable';
import FXTransactionStatistics from './FXTransactionStatistics';

import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
    currency: '',
    againstCurrency: '',
    dateFrom: '',
    dateTo: '',
    message: '',
}

function FXTransactionList () {

    const [formData, setFormData] = useState(initialState);
    const [fxTransactionsObj, setFXTransactionsObj] = useState([]);

    const loadFXTransactionsObj = () => {
        setFormData({
            ...formData,
            message: '',
        })
        TransactionRequest.getFXTransactions(formData.currency, formData.againstCurrency, 
            formData.dateFrom, formData.dateTo)
        .then(fxTransactionsObj => setFXTransactionsObj(fxTransactionsObj))
        .catch( err => {
            console.log(err);
            setFormData({
                ...formData,
                message: err.response.data,
            })
        })
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleDateFromChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateFrom: date
        });
    }
    
    const handleDateToChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateTo: date
        });
    }

    const handleListClick = () => {
        loadFXTransactionsObj();
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    return (
        <React.Fragment>
            <FormContainer title="FX Transactions">
                <Form>
                    <Row>
                        <Col>
                        <Form.Control as="select" size="sm" name="currency" 
                            onChange={handleChange}
                            value={formData.currency}>
                            <option value=''>Main Currency</option>
                            <CurrenciesDropDown />
                        </Form.Control>
                        </Col>
                        <Col>
                        <Form.Control as="select" size="sm" name="againstCurrency" 
                            onChange={handleChange}
                            value={formData.againstCurrency}>
                            <option value=''>Against Currency</option>
                            <CurrenciesDropDown />
                        </Form.Control>
                        </Col>
                        <Col>
                        <DatePickerInput value={formData.dateFrom}
                            onChange={handleDateFromChange} readOnly 
                            placeholder="Posting Date From" small/>
                        </Col>
                        <Col>
                        <DatePickerInput value={formData.dateTo}
                            onChange={handleDateToChange} readOnly 
                            placeholder="Posting Date From" small/>
                        </Col>
                        <Col xs={1}>
                        <Button variant="primary" size="sm" block onClick={handleListClick}>
                                List</Button>
                        </Col>
                        <Col xs={1}>
                        <Button variant="secondary" size="sm" block onClick={handleResetClick}>
                            Reset</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Form.Text className='text-danger'>{formData.message}</Form.Text>
                        </Col>
                    </Row>
                </Form>
            </FormContainer>
            <FormContainer>
                {
                    fxTransactionsObj.length!==0 &&
                    <FXTransactionStatistics 
                    currency={fxTransactionsObj.currency}
                    againstCurrency={fxTransactionsObj.againstCurrency}
                    currencyDecimalPlace={fxTransactionsObj.currencyDecimalPlace}
                    againstCurrencyDecimalPlace={fxTransactionsObj.againstCurrencyDecimalPlace}
                    fxInCurrencyTotal={fxTransactionsObj.fxInCurrencyTotal}
                    fxInAgainstCurrencyTotal={fxTransactionsObj.fxInAgainstCurrencyTotal}
                    fxOutCurrencyTotal={fxTransactionsObj.fxOutCurrencyTotal}
                    fxOutAgainstCurrencyTotal={fxTransactionsObj.fxOutAgainstCurrencyTotal}
                    fxInAverage={fxTransactionsObj.fxInAverage}
                    fxOutAverage={fxTransactionsObj.fxOutAverage}
                    />
                }
            </FormContainer>
            <FormContainer>
                <FXTransactionTable fxTransactions={fxTransactionsObj.fxTransactions}/>
            </FormContainer>
        </React.Fragment>
    );
}

export default FXTransactionList;