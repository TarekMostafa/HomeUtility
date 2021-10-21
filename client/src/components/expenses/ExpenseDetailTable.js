import React from 'react';
import { Table } from 'react-bootstrap';

import ExpenseDetailAddRow from './ExpenseDetailAddRow';
import ExpenseDetailRow from './ExpenseDetailRow';

function ExpenseDetailTable(props) {

    return (
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Description</th>
                    <th>Expense Type</th>
                    <th>Adjusment</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <ExpenseDetailAddRow expense={props.expense} onAdd={props.onAdd}/>
                {
                    props.expenseDetails && props.expenseDetails.map(elem => {
                        return (
                            <ExpenseDetailRow key={elem.expenseDetailId}
                                expenseDetail={elem} 
                                onDelete={props.onDelete}/>
                        )
                    })
                }
            </tbody>
        </Table>
    );
}

export default ExpenseDetailTable;