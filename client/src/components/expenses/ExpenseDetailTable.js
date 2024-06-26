import React from 'react';
import { Table } from 'react-bootstrap';

import ExpenseDetailAddRow from './ExpenseDetailAddRow';
import ExpenseDetailRow from './ExpenseDetailRow';

function ExpenseDetailTable(props) {

    return (
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Description</th>
                    <th>Expense Type</th>
                    <th>Adjusment</th>
                    <th>Id</th>
                    {!props.readOnly && <th></th>}
                </tr>
            </thead>
            <tbody>
                {
                    props.expense && <ExpenseDetailAddRow expense={props.expense} onAdd={props.onAdd}/>
                }
                {
                    props.expenseDetails && props.expenseDetails.filter(elem => {
                        if(!props.searchFilter) return true;
                        switch(props.searchFilter.name) {
                            case "expenseType":
                                return props.searchFilter.value.toString() === elem.expenseTypeId+'';
                            case "adjusment":
                                return props.searchFilter.value === elem.expenseAdjusment;
                            case "negative":
                                return elem.expenseAmount < 0;
                            default:
                                return true;
                        } 
                    }).map((elem, index) => {
                        return (
                            <ExpenseDetailRow key={elem.expenseDetailId}
                                expenseDetail={elem} 
                                onDelete={props.onDelete}
                                onEdit={props.onEdit} index={index+1} {...props}/>
                        )
                    })
                }
            </tbody>
        </Table>
    );
}

export default ExpenseDetailTable;