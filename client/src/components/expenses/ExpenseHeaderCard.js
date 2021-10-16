import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { getMonthName } from '../common/MonthYearField';

function ExpenseHeaderCard(props) {

    const { expense } = props;

    return (
        <Card>
            {
                expense && 
                <Card.Header>
                {getMonthName(expense.month)} {expense.year} ({expense.currency})
                {props.onEdit && <Button className="float-right" variant="link" size="sm"
                  onClick={() => props.onEdit()}>Edit</Button>}
                </Card.Header>
            }
            <Card.Body>
                <Row>
                    <Col xs={5}><strong>Open Balance:</strong></Col>
                    <Col xs={5}>{expense?expense.openBalance:0}</Col>
                    <Col xs={2}><Badge variant="success">{expense && expense.status}</Badge></Col>
                </Row>
                <Row>
                    <Col xs={5}><strong>Adjusments:</strong></Col>
                    <Col xs={5}>{expense?expense.adjusments:0}</Col>
                </Row>
                <Row>
                    <Col xs={5}><strong>Debits:</strong></Col>
                    <Col xs={5}>{expense?expense.debits:0}</Col>
                </Row>
                <Row>
                    <Col xs={5}><strong>Close Balance:</strong></Col>
                    <Col xs={5}>{expense?expense.closeBalance:0}</Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ExpenseHeaderCard;