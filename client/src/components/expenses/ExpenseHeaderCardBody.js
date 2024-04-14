import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import amountFormatter from '../../utilities/amountFormatter';

function ExpenseHeaderCardBody(props) {

    const { expense } = props;

    return (
        expense && <Card.Body>
            <Row>
                <Col xs={6}><strong>Open Balance:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)}</Col>
                <Col xs={1}><Badge variant={expense.expenseStatus==="CLOSED"?"warning":"success"}>{expense && expense.expenseStatus}</Badge></Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Accounts Debits:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseTotalAccountDebit, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Adjusments:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Expense Debits:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Calculated Balance:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseCalculatedBalance, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={6}><strong>Close Balance:</strong></Col>
                <Col xs={3}>{amountFormatter(expense.expenseCloseBalance, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBody;