import React, {useState, useEffect} from 'react';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';
import ExpenseDetailTable from './ExpenseDetailTable';
import ExpenseTypeRowList from './ExpenseTypeRowList';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

function ExpenseDetailList(props) {

    const expense = props.location.expense;
    const [expenseDetails, setExpenseDetails] = useState([]);

    const loadExpenseDetails = () => ExpenseDetailRequest.getExpenseDetails(expense.id)
        .then(expenseDetails => setExpenseDetails(expenseDetails));

    useEffect(()=>{
        loadExpenseDetails();
    },[])

    return (
        <FormContainer title="Expense Details">
            <ExpenseHeaderCard expense={expense} />
            <FormContainer>
                <ExpenseTypeRowList />
            </FormContainer>
            <ExpenseDetailTable expense={expense} 
                expenseDetails={expenseDetails} 
                onAdd={()=> loadExpenseDetails()}
                onDelete={()=> loadExpenseDetails()}/>
        </FormContainer>
    );
}

export default ExpenseDetailList;