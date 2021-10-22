import React, {useState, useEffect} from 'react';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';
import ExpenseDetailTable from './ExpenseDetailTable';
import ExpenseTypeRowList from './ExpenseTypeRowList';
import ExpenseRequest from '../../axios/ExpenseRequest'
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

function ExpenseDetailList(props) {

    const [expense, setExpense] = useState(null);
    const [expenseDetails, setExpenseDetails] = useState([]);

    const loadData = id => {
        ExpenseRequest.getExpense(id)
        .then(expense => setExpense(expense));
        ExpenseDetailRequest.getExpenseDetails(id)
        .then(expenseDetails => setExpenseDetails(expenseDetails));
    }

    const groupExpenseTypes = (expenseDetails) =>  {
        return expenseDetails.filter(elem => elem.expenseTypeId).reduce( (group, elem) => {
            group[elem.expenseTypeId] = {
                name: elem.expenseType.expenseTypeName,
                totalAmt: Number((group && group[elem.expenseTypeId] ? group[elem.expenseTypeId].totalAmt : 0))
                     + Number(elem.expenseAmount)
            }
            return group;
        }, {});
    }

    useEffect(()=>{
        loadData(props.match.params.id);
    },[])

    return (
        <FormContainer title="Expense Details">
        {
            expense && <React.Fragment>
                <ExpenseHeaderCard expense={expense} inline/>
                <FormContainer>
                    <ExpenseTypeRowList groupExpenseTypes={groupExpenseTypes(expenseDetails)}/>
                </FormContainer>
                <ExpenseDetailTable expense={expense} 
                    expenseDetails={expenseDetails} 
                    onAdd={()=> loadData(props.match.params.id)}
                    onDelete={()=> loadData(props.match.params.id)}/>
            </React.Fragment>
        }
        </FormContainer>
    );
}

export default ExpenseDetailList;