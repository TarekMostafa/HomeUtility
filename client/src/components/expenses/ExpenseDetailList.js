import React, {useState, useEffect} from 'react';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';
import ExpenseDetailTable from './ExpenseDetailTable';
import ExpenseTypeRowList from './ExpenseTypeRowList';
import ExpenseDetailSummary from './ExpenseDetailSummary';
import ExpenseRequest from '../../axios/ExpenseRequest'
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';
import ExpenseTotalAccountDebitDifference from './ExpenseTotalAccountDebitDifference';
import ExpenseApplyTotalAccountDebitDifference from './ExpenseApplyTotalAccountDebitDifference';

function ExpenseDetailList(props) {

    const [expense, setExpense] = useState(null);
    const [expenseDetails, setExpenseDetails] = useState([]);
    const [searchFilter, setSearchFilter] = useState(null);
    const [modalApplyShow, setModalApplyShow] = useState(false);

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

    let diffAmount = 0;
    if(expense) {
        diffAmount = expense.expenseCurrentAccountsDebit - expense.expenseTotalAccountDebit;
    }

    return (
        <FormContainer title="Expense Details">
        {
            expense && <React.Fragment>
                {diffAmount !== 0 &&
                <ExpenseTotalAccountDebitDifference 
                amount={diffAmount}
                decimalPlace={expense.currency.currencyDecimalPlace}
                currency={expense.expenseCurrency} 
                onApply={expense.expenseStatus==='CLOSED'?null:()=>setModalApplyShow(true)}/>
                }
                <ExpenseHeaderCard expense={expense} inline/>
                <FormContainer>
                    <ExpenseDetailSummary expenseDetails={expenseDetails}
                        onAllClick={() => setSearchFilter(null)}
                        onDebitClick={() => setSearchFilter({name:'adjusment', value:false})}
                        onAdjClick={() => setSearchFilter({name:'adjusment', value:true})}
                        onNegClick={() => setSearchFilter({name:'negative', value:''})}/>
                    <ExpenseTypeRowList groupExpenseTypes={groupExpenseTypes(expenseDetails)}
                        onExpenseTypeClick={type => setSearchFilter({name:'expenseType', value:type})}/>
                </FormContainer>
                <ExpenseDetailTable expense={expense.expenseStatus==='CLOSED'?null:expense} 
                    expenseDetails={expenseDetails} 
                    searchFilter={searchFilter}
                    readOnly={expense.expenseStatus==='CLOSED'}
                    onAdd={()=> loadData(props.match.params.id)}
                    onDelete={()=> loadData(props.match.params.id)}
                    onEdit={()=> loadData(props.match.params.id)}/>
            </React.Fragment>
        }
        {
            modalApplyShow && <ExpenseApplyTotalAccountDebitDifference 
            expense={expense} 
            show={modalApplyShow}
            onHide={()=>setModalApplyShow(false)}
            onApply={()=>loadData(expense.expenseId)}/>
        }
        </FormContainer>
    );
}

export default ExpenseDetailList;