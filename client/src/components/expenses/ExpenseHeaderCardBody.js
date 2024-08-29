import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
// import amountFormatter from '../../utilities/amountFormatter';

function ExpenseHeaderCardBody(props) {

    const { expense } = props;

    return (
        expense && <Card.Body>
            <Row>
                <Col xs={6}><strong>Open Balance:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseOpenBalanceFormatted}
                </Col>
                <Col xs={1}><Badge variant={expense.expenseStatus==="CLOSED"?"warning":"success"}>{expense && expense.expenseStatus}</Badge></Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Account Debits:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseTotalAccountDebit, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseTotalAccountDebitFormatted}
                </Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Adjusments:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseAdjusmentsFormatted}
                </Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Total Debits:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseDebitsFormatted}
                </Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Calculated Balance:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseCalculatedBalance, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseCalculatedBalanceFormatted}
                </Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Close Balance:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseCloseBalance, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseCloseBalanceFormatted}
                </Col>
            </Row>
            <Row>
                <Col><hr /></Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Real Accounts Debits:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseRealAccountDebits, expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseRealAccountDebitsFormatted}
                </Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Difference:</strong></Col>
                <Col xs={3}>
                    {/* {amountFormatter(expense.expenseRealAccountDebits-expense.expenseTotalAccountDebit
                    , expense.currency.currencyDecimalPlace)} */}
                    {expense.expenseDifferenceAccountDebitsFormatted}
                </Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBody;