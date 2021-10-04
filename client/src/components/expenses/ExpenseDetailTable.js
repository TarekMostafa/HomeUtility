import React from 'react';
import { Table } from 'react-bootstrap';

import ExpenseDetailAddRow from './ExpenseDetailAddRow';

function ExpenseDetailTable() {

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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <ExpenseDetailAddRow></ExpenseDetailAddRow>
            </tbody>
        </Table>
    );
}

export default ExpenseDetailTable;