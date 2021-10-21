import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

function ExpenseHeaderCardBodyInline(props) {

    const { expense } = props;

    return (
        <Card.Body>
            <Row>
                <Col xs={3}>
                    <strong>Open Balance: </strong>
                    {expense?expense.expenseOpenBalance:0}
                </Col>
                <Col xs={2}>
                    <strong>Adjusments: </strong>
                    {expense?expense.expenseAdjusments:0}
                </Col>
                <Col xs={3}>
                    <strong>Debits: </strong>
                    {expense?expense.expenseDebits:0}
                </Col>
                <Col xs={3}>
                    <strong>Close Balance: </strong>
                    {expense?expense.expenseCloseBalance:0}
                </Col>
                <Col xs={1}>
                    <Badge variant="success">{expense && expense.status}</Badge>
                </Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBodyInline;