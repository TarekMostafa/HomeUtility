import React, {useState} from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';

import ModalContainer from '../common/ModalContainer';
import MonthYearField from '../common/MonthYearField';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import ExpenseRequest from '../../axios/ExpenseRequest';

const initialState = {
    isLoading: false,
    message: "",
    month: new Date().getMonth()+1,
    year: new Date().getFullYear(),
    currency: "",
    decimalPlaces: 0,
    openBalance: 0,
}

function ExpenseHeaderAddModal(props) {

    const [formData, setFormData] = useState(initialState);

    const handleCurrencyChange = (e) => {
        const decimalPlaces = e.target[e.target.selectedIndex].getAttribute('decimalplaces');
        setFormData({...formData, decimalPlaces, currency:e.target.value});
    }

    const handleOnClick = () => {
        // Validate Input
        if(!formData.year || !formData.month) {
            setFormData({...formData, message: "Invalid expense month/year"});
            return;
        } else if(!formData.currency) {
            setFormData({...formData, message: "Invalid expense currency"});
            return;
        } else {
            setFormData({...formData, message: "", isLoading: true});
        }
        // Add new expense
        ExpenseRequest.addExpense(formData.year, formData.month, formData.currency,
            formData.openBalance)
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
        <ModalContainer title="Create New Expense" show={props.show}
            onHide={props.onHide} onShow={() => setFormData(initialState)}
            footer={
                <Button variant="primary" block onClick={handleOnClick}>
                {
                  formData.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Create'
                }
                </Button>
            }>
            <Form>
                <MonthYearField 
                    label = "Expense Month/Year"
                    name="expenseMonthYear"
                    year={formData.year} 
                    month={formData.month}
                    onChangeYear={year=>setFormData({...formData, year})}
                    onChangeMonth={month=>setFormData({...formData, month})}
                />
                <Form.Group controlId="expenseCurrency">
                    <Form.Label>Expense Currency</Form.Label>
                    <Form.Control as="select" name="expenseCurrency" 
                        onChange={handleCurrencyChange}>
                    <option value=''></option>
                    <CurrenciesDropDown />
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="expenseOpenBalance">
                    <Form.Label>Opening Balance</Form.Label>
                    <Form.Control type="number" maxLength={20}
                    name="expenseOpenBalance"
                    value={Number(formData.openBalance).toFixed(formData.decimalPlaces)}
                    onChange={e=>setFormData({...formData, openBalance:e.target.value})}/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </Form>
        </ModalContainer>
    )
}

export default ExpenseHeaderAddModal;