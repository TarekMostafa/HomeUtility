import React, {useState, useEffect} from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../common/ModalContainer';
import MonthYearField from '../common/MonthYearField';
import TransactionTypesChips from '../wealth/transactiontypes/TransactionTypesChips';
import ExpenseRequest from '../../axios/ExpenseRequest';
import AccountStatusesDropDown from '../wealth/accounts/AccountStatusesDropDown'; 

const initialState = {
    isLoading: false,
    message: "",
    openBalance: 0,
    debitTransTypes: [],
    expenseStatus: '',
}

function ExpenseHeaderEditModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [expense, setExpense] = useState(null);

    const loadExpense = (id) => ExpenseRequest.getExpense(id).then(expense => {
        setExpense(expense);
        if(expense) setFormData({
            ...formData, 
            openBalance: expense.expenseOpenBalance,
            debitTransTypes: (expense.expenseDebitTransTypes ? 
                props.transactionTypes.filter(
                    e=> expense.expenseDebitTransTypes.split(',').includes(e.typeId+''))
            : []),
            expenseStatus: expense.expenseStatus,
        });
    });

    useEffect(()=>{
        if(props.expenseId) loadExpense(props.expenseId);
    },[props.expenseId])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    }

    const handleOnClick = () => {
        setFormData({...formData, message: "", isLoading: true});
        // update expense
        ExpenseRequest.updateExpense(expense.expenseId, 
            formData.openBalance, 
            formData.debitTransTypes.map(e=>e.typeId).join(','),
            formData.expenseStatus)                      
        .then( () => {
            if (typeof props.onSave=== 'function') {
                props.onSave();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    const handleChipChange = (chips) => {
        setFormData({
            ...formData,
            debitTransTypes: chips
        })
    }

    return (
        <ModalContainer title="Edit Expense" show={props.show}
            onHide={props.onHide} onShow={() => setFormData(initialState)}
            footer={
                expense && <Button variant="primary" block onClick={handleOnClick}>
                {
                  formData.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Save'
                }
                </Button>
            }>
            {
                expense && <Form>
                    <MonthYearField 
                    label = "Expense Month/Year"
                    name="expenseMonthYear"
                    year={expense.expenseYear} 
                    month={expense.expenseMonth}
                    disabled/>
                    <Form.Group controlId="expenseCurrency">
                        <Form.Label>Expense Currency</Form.Label>
                        <Form.Control name="expenseCurrency" type="input" readOnly
                            value={expense.expenseCurrency} />
                    </Form.Group>
                    <Form.Group controlId="expenseOpenBalance">
                        <Form.Label>Opening Balance</Form.Label>
                        <Form.Control type="number" maxLength={20}
                        name="expenseOpenBalance"
                        value={Number(formData.openBalance).toFixed(expense.currency.currencyDecimalPlace)}
                        onChange={e=>setFormData({...formData, openBalance:e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="debitTransTypes">
                        <Form.Label>
                            {'Allowed Debit Transaction Types (' + formData.debitTransTypes.length + ')' }
                        </Form.Label>
                        <TransactionTypesChips value={formData.debitTransTypes}
                            onChange={handleChipChange} name="debitTransTypes"
                            onFilter={e => e.typeCRDR==='Debit'}/>
                    </Form.Group>
                    <Form.Group controlId="expenseStatus">
                        <Form.Label>Expense Status</Form.Label>
                        <Form.Control as="select" name="expenseStatus" onChange={handleChange}
                        value={formData.expenseStatus}>
                            <option value=''></option>
                            <AccountStatusesDropDown />
                        </Form.Control>
                    </Form.Group>
                    <Form.Text className='text-danger'>{formData.message}</Form.Text>
                </Form>
            }
        </ModalContainer>
    )
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(ExpenseHeaderEditModal);