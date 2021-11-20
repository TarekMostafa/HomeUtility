import React from 'react';
import { Table } from 'react-bootstrap';

import CardTransactionPaymentRow from './CardTransactionPaymentRow';

function CardTransactionPaymentTable (props) {
    return (
      <Table hover bordered size="sm" responsive="sm">
        <thead>
            <tr>
            <th>#</th>
            <th>Trans Amount</th>
            <th>Trans Currency</th>
            <th>Trans Date</th>
            <th>Trans Desc</th>
            <th>Bill Amount</th>
            <th>Is Installment?</th>
            <th>Id</th>
            { props.appearPayCol && <th>Pay</th>}
            </tr>
        </thead>
        <tbody>
        {
            props.cardTransactions && props.cardTransactions.map( (cardTransaction, index) => {
                return (
                    <CardTransactionPaymentRow key={index}
                        cardTransaction={cardTransaction} index={index} 
                        onPay={props.onPay} appearPayCol={props.appearPayCol}/>
                )
            })
        }
        </tbody>
      </Table>
    )
}

export default CardTransactionPaymentTable;