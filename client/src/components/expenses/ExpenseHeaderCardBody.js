import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import amountFormatter from '../../utilities/amountFormatter';

function ExpenseHeaderCardBody(props) {

    const { expense } = props;

    return (
        expense && <Card.Body>
            <Row>
                <Col xs={5}><strong>Open Balance:</strong></Col>
                <Col xs={5}>{amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)}</Col>
                <Col xs={2}><Badge variant="success">{expense && expense.status}</Badge></Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Accounts Debits:</strong></Col>
                <Col xs={5}>{amountFormatter(expense.totalAccountsDebitTrans, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Adjusments:</strong></Col>
                <Col xs={5}>{amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Expense Debits:</strong></Col>
                <Col xs={5}>{amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Close Balance:</strong></Col>
                <Col xs={5}>{amountFormatter(expense.expenseCloseBalance, expense.currency.currencyDecimalPlace)}</Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBody;