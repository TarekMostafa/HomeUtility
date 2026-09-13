import React, {useState} from 'react';
import { Table, Form } from 'react-bootstrap';

import CardTransactionPaymentRow from './CardTransactionPaymentRow';

function CardTransactionPaymentTable (props) {

    const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);

    const handleOnSelect = (checked, trans) => {
        if(checked) setSelectedPaymentIds((paymentIds) => [...paymentIds, trans.cardTransId]);
        else setSelectedPaymentIds((paymentIds) => paymentIds.filter(id=> id !== trans.cardTransId));
        if(props.onPay) props.onPay(checked, trans);
    }

    const handleOnSelectAll = (event) => {
        if(event.target.checked) setSelectedPaymentIds(props.cardTransactions.map(trans=>trans.cardTransId));
        else setSelectedPaymentIds([]);
        if(props.onPay) props.onPay(event.target.checked, props.cardTransactions);
    }

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
            { props.appearPayCol && <th><Form.Check type="checkbox" 
                label="Pay" checked={(selectedPaymentIds.length>0 && selectedPaymentIds.length===props.cardTransactions.length)} 
                onChange={handleOnSelectAll}/></th>}
            </tr>
        </thead>
        <tbody>
        {
            props.cardTransactions && props.cardTransactions.map( (cardTransaction, index) => {
                return (
                    <CardTransactionPaymentRow key={index}
                        cardTransaction={cardTransaction} index={index} 
                        onSelect={handleOnSelect} 
                        appearPayCol={props.appearPayCol}
                        isSelected={selectedPaymentIds.includes(cardTransaction.cardTransId)}/>
                )
            })
        }
        </tbody>
      </Table>
    )
}

export default CardTransactionPaymentTable;