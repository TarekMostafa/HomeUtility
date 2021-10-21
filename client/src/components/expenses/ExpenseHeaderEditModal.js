import React, {useState, useEffect} from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';

import ModalContainer from '../common/ModalContainer';
import MonthYearField from '../common/MonthYearField';
import ExpenseRequest from '../../axios/ExpenseRequest';

const initialState = {
    isLoading: false,
    message: "",
    openBalance: 0,
}

function ExpenseHeaderEditModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [expense, setExpense] = useState(null);

    const loadExpense = (id) => ExpenseRequest.getExpense(id).then(expense => {
        setExpense(expense);
        if(expense) setFormData({...formData, openBalance: expense.expenseOpenBalance});
    });

    useEffect(()=>{
        if(props.expenseId) loadExpense(props.expenseId);
    },[props.expenseId])

    const handleOnClick = () => {
        setFormData({...formData, message: "", isLoading: true});
        // update expense
        ExpenseRequest.updateExpense(expense.expenseId, formData.openBalance)
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
                    <Form.Text className='text-danger'>{formData.message}</Form.Text>
                </Form>
            }
        </ModalContainer>
    )
}

export default ExpenseHeaderEditModal;