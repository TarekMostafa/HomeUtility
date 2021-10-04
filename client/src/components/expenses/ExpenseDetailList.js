import React from 'react';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';
import ExpenseDetailTable from './ExpenseDetailTable';
import ExpenseTypeRowList from './ExpenseTypeRowList';

function ExpenseDetailList(props) {

    return (
        <FormContainer title="Expense Details">
            <ExpenseHeaderCard expense={props.location.expense}></ExpenseHeaderCard>
            <FormContainer>
                <ExpenseTypeRowList></ExpenseTypeRowList>
            </FormContainer>
            <ExpenseDetailTable></ExpenseDetailTable>
        </FormContainer>
    );
}

export default ExpenseDetailList;