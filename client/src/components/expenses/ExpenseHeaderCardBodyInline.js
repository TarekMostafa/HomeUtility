import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import amountFormatter from '../../utilities/amountFormatter';

function ExpenseHeaderCardBodyInline(props) {

    const { expense } = props;

    return (
        expense && <Card.Body>
            <Row>
                <Col xs={2}>
                    <strong>Open Balance: </strong>
                    {amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col xs={2}>
                    <strong>Accounts Debits: </strong>
                    {amountFormatter(expense.totalAccountsDebitTrans, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col xs={2}>
                    <strong>Adjusments: </strong>
                    {amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col xs={2}>
                    <strong>Expense Debits: </strong>
                    {amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col xs={2}>
                    <strong>Close Balance: </strong>
                    {amountFormatter(expense.expenseCloseBalance, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col xs={2}>
                    <Badge variant="success">{expense && expense.status}</Badge>
                </Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBodyInline;