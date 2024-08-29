import React, {useState, useEffect} from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../common/ModalContainer';
import MonthYearField from '../common/MonthYearField';
import ExpenseRequest from '../../axios/ExpenseRequest';

const initialState = {
    isLoading: false,
    message: "",
    diffAmount: 0
}

function ExpenseApplyTotalAccountDebitDifference(props) {

    const [formData, setFormData] = useState(initialState);
    const {expense} = props;

    useEffect(()=>{
        setFormData({
            ...formData, 
            //diffAmount:expense.expenseCurrentAccountsDebit - expense.expenseTotalAccountDebit
            diffAmount: expense.expenseDifferenceAccountDebits
        });
    },[expense])

    const handleOnClick = () => {
        setFormData({...formData, message: "", isLoading: true});
        // update expense
        ExpenseRequest.updateTotalAccountDebit(expense.expenseId, 
            formData.diffAmount)                      
        .then( () => {
            if (typeof props.onApply=== 'function') {
                props.onApply();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    return (
        <ModalContainer title="Apply Total Account Debit Difference" show={props.show}
            onHide={props.onHide} onShow={() => setFormData(initialState)}
            footer={
                expense && <Button variant="primary" block onClick={handleOnClick}>
                {
                  formData.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Apply'
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
                    <Form.Group controlId="currentAccountsDebit">
                        <Form.Label>Calculated Current Account Debit</Form.Label>
                        <Form.Control type="input" maxLength={20}
                        name="currentAccountsDebit" 
                        //value={Number(expense.expenseCurrentAccountsDebit).toFixed(expense.currency.currencyDecimalPlace)} 
                        value={expense.expenseRealAccountDebitsFormatted}
                        readOnly
                    />
                    </Form.Group>
                    <Form.Group controlId="totalAccountDebit">
                        <Form.Label>Registered Total Account Debit</Form.Label>
                        <Form.Control type="input" maxLength={20}
                        name="totalAccountDebit" 
                        //value={Number(expense.expenseTotalAccountDebit).toFixed(expense.currency.currencyDecimalPlace)} 
                        value={expense.expenseTotalAccountDebitFormatted}
                        readOnly
                    />
                    </Form.Group>
                    <Form.Group controlId="diffAmount">
                        <Form.Label>Difference Amount</Form.Label>
                        <Form.Control type="number" maxLength={20}
                        name="expenseOpenBalance"
                        value={Number(formData.diffAmount).toFixed(expense.currency.currencyDecimalPlace)}
                        onChange={e=>setFormData({...formData, diffAmount:e.target.value})}/>
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

export default connect(mapStateToProps)(ExpenseApplyTotalAccountDebitDifference);