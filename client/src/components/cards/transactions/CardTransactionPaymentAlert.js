import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';

import amountFormatter from '../../../utilities/amountFormatter';

function CardTransactionPaymentAlert (props) {
    return (
        <Alert variant='primary'>
            <Row>
                <Col md={{span:6, offset:4}}>
                    Total Payments: <strong>
                    {
                        props.cardTransactions && props.card && amountFormatter(
                            props.cardTransactions.reduce( (prv, current) => 
                                prv += Number(current.cardTransBillAmount), 0), 
                                props.card.currency.currencyDecimalPlace
                            ) + ' ' + props.card.cardCurrency
                    }
                    </strong>
                </Col>
            </Row>
        </Alert>
    )
}

export default CardTransactionPaymentAlert;