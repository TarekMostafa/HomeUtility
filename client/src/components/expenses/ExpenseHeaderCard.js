import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

function ExpenseHeaderCard(props) {

    var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const { expense } = props;

    return (
        <Card>
            {
                expense && 
                <Card.Header>
                {months[expense.month-1]} {expense.year} ({expense.currency})
                {props.onEdit && <Button className="float-right" variant="link" size="sm"
                  onClick={() => props.onEdit()}>Edit</Button>}
                </Card.Header>
            }
            <Card.Body>
                <Row>
                    <Col><strong>Open Balance:</strong></Col>
                    <Col>{expense?expense.openBalance:0}</Col>
                    <Col><strong>Adjusments:</strong></Col>
                    <Col>{expense?expense.adjusments:0}</Col>
                    <Col><strong>Debits:</strong></Col>
                    <Col>{expense?expense.debits:0}</Col>
                    <Col><strong>Close Balance:</strong></Col>
                    <Col>{expense?expense.closeBalance:0}</Col>
                    <Col><Badge variant="success">{expense && expense.status}</Badge></Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ExpenseHeaderCard;