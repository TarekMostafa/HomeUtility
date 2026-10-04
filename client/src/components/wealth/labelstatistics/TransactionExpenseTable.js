import React from 'react';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';

function TransactionExpenseTable (props) {
    if(!(props.transactions && Array.isArray(props.transactions) 
    && props.expenseDetails && Array.isArray(props.expenseDetails)))
        return null;

    let transactionExpenseList = props.transactions.map(t => {
        let amount = t.transactionAmountFormatted;
        if(t.transactionCRDR==="Debit") amount="-"+amount.trim();
        return { 
            date: t.transactionValueDate,
            amount: amount,
            currency: t.accountCurrency,
            description: t.transactionNarrative,
            Id: "t_"+t.transactionId
        }
    });
    
    props.expenseDetails.forEach(e => {
        const index = transactionExpenseList.findIndex(item => item.date < e.expenseDate);
        let amount = e.expenseAmountFormatted;
        if(!e.expenseAdjusment) {
            if(amount.includes('-')) amount = amount.replace('-',' ');
            else amount="-"+amount.trim();
        }
        transactionExpenseList.splice(index, 0, {
            date: e.expenseDate,
            amount: amount,
            currency: e.expenseCurrency,
            description: e.expenseDescription,
            Id: "e_"+e.expenseDetailId
        });
    });

    const getCellColor = (amount) => {
        if(amount.includes('-')) return {color:'#ff0000'};
    }

    return (
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                <th>#</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Narrative/Description</th>
                <th>Id</th>
                </tr>
            </thead>
            <tbody>
            {
                transactionExpenseList && transactionExpenseList.map( (item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                            <td className="text-right" style={getCellColor(item.amount)}>
                                {item.amount}
                            </td>
                            <td>{item.currency}</td>
                            <td>
                                <OverlayTrigger placement="right"
                                delay={{ show: 250, hide: 400 }} overlay={(
                                    <Tooltip>{item.description}</Tooltip>
                                )}>
                                    <span className="textEllipsis">
                                        {item.description}
                                    </span>
                                </OverlayTrigger>
                            </td>
                            <td>{item.Id}</td>
                        </tr>
                    )
                })
            }    
            </tbody>
        </Table>
    )
}

export default TransactionExpenseTable;