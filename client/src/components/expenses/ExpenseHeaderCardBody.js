import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

function ExpenseHeaderCardBody(props) {

    const { expense } = props;

    return (
        <Card.Body>
            <Row>
                <Col xs={5}><strong>Open Balance:</strong></Col>
                <Col xs={5}>{expense?expense.expenseOpenBalance:0}</Col>
                <Col xs={2}><Badge variant="success">{expense && expense.status}</Badge></Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Adjusments:</strong></Col>
                <Col xs={5}>{expense?expense.expenseAdjusments:0}</Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Debits:</strong></Col>
                <Col xs={5}>{expense?expense.expenseDebits:0}</Col>
            </Row>
            <Row>
                <Col xs={5}><strong>Close Balance:</strong></Col>
                <Col xs={5}>{expense?expense.expenseCloseBalance:0}</Col>
            </Row>
        </Card.Body>
    )
}

export default ExpenseHeaderCardBody;