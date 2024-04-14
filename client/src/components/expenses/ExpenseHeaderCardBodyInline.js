import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import amountFormatter from '../../utilities/amountFormatter';

function ExpenseHeaderCardBodyInline(props) {

    const { expense } = props;

    return (
        expense && <Card.Body>
            <Row>
                <Col><strong>Open Balance</strong></Col>
                <Col><strong>Accounts Debits</strong></Col>
                <Col><strong>Adjusments</strong></Col>
                <Col><strong>Expense Debits</strong></Col>
                <Col><strong>Calculated Balance</strong></Col>
                <Col><strong>Close Balance</strong></Col>
                <Col>
                    <Badge variant={expense.expenseStatus==="CLOSED"?"warning":"success"}>{expense && expense.expenseStatus}</Badge>
                </Col>
            </Row>
            <Row>
                <Col>
                    {amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                    {amountFormatter(expense.expenseTotalAccountDebit, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                    {amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                    {amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                    {amountFormatter(expense.expenseCalculatedBalance, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                    {amountFormatter(expense.expenseCloseBalance, expense.currency.currencyDecimalPlace)}
                </Col>
                <Col>
                </Col>
            </Row>
        </Card.Body>
    )

    // return (
    //     expense && <Card.Body>
    //         <Row>
    //             <Col xs={2}>
    //                 <strong>Open Balance: </strong>
    //                 {amountFormatter(expense.expenseOpenBalance, expense.currency.currencyDecimalPlace)}
    //             </Col>
    //             <Col xs={2}>
    //                 <strong>Accounts Debits: </strong>
    //                 {amountFormatter(expense.expenseTotalAccountDebit, expense.currency.currencyDecimalPlace)}
    //             </Col>
    //             <Col xs={2}>
    //                 <strong>Adjusments: </strong>
    //                 {amountFormatter(expense.expenseAdjusments, expense.currency.currencyDecimalPlace)}
    //             </Col>
    //             <Col xs={2}>
    //                 <strong>Expense Debits: </strong>
    //                 {amountFormatter(expense.expenseDebits, expense.currency.currencyDecimalPlace)}
    //             </Col>
    //             <Col xs={2}>
    //                 <strong>Calculated Balance: </strong>
    //                 {amountFormatter(expense.expenseCalculatedBalance, expense.currency.currencyDecimalPlace)}
    //             </Col>
    //             <Col xs={2}>
    //                 <Badge variant="success">{expense && expense.status}</Badge>
    //             </Col>
    //         </Row>
    //     </Card.Body>
    // )
}

export default ExpenseHeaderCardBodyInline;