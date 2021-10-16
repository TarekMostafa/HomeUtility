import React, {useState} from 'react';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDown';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

const initialState = {
    expenseDate: '',
    expenseAmt: 0,
    expenseCcy: '',
    expenseDesc: '',
    expenseType: 0,
    expenseAdj: false,
    isLoading: false,
    message: "",
    messageClass: ""
}

function ExpenseDetailAddRow(props) {

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
        })
    }

    const handleExpenseDateChange = (jsDate, date) => {
        setFormData({
            ...formData,
            expenseDate: date
        })
    }

    const handleExpenseDetailAdd = () => {
        // Validate Input
        if(!formData.expenseDate) {
            setFormData({...formData, message: "Invalid date"});
            return;
        } else if(!formData.expenseAmt) {
            setFormData({...formData, message: "Invalid amount"});
            return;
        } else if(!formData.expenseDesc) {
            setFormData({...formData, message: "Invalid description"});
            return;
        } else if(!formData.expenseType) {
            setFormData({...formData, message: "Invalid expense type"});
            return;
        } else {
            setFormData({...formData, message: "", isLoading: true});
        }
        ExpenseDetailRequest.addExpenseDetail(
            props.expense.id, 
            new Date(formData.expenseDate).getDate(),
            formData.expenseAmt,
            formData.expenseDesc,
            formData.expenseType,
            formData.expenseAdj)
        .then( (result) => {
            if (typeof props.onAdd=== 'function') {
                props.onAdd();
            }
            setFormData({
                ...initialState,
                message: result.data,
                messageClass: 'text-success'
            });
        })
        .catch( err => {
            setFormData({
                ...formData, 
                isLoading: false,
                message: err.response.data,
                messageClass: 'text-danger'
            });
        })
    }

    const [formData, setFormData] = useState({
        ...initialState, 
        expenseCcy: (props.expense? props.expense.currency: '')
    });

    return (
        <tr key={'AddRow'}>
            <td></td>
            <td>
                <DatePickerInput readOnly small placeholder="Expense Date" 
                value={formData.expenseDate} onChange={handleExpenseDateChange}
                minDate={new Date(props.expense.year, props.expense.month-1, 1)}
                maxDate={new Date(props.expense.year, props.expense.month-1, 31)}
                />
            </td>
            <td colSpan='2'>
                <InputGroup size="sm">
                    <Form.Control size="sm" type="number" placeholder="Amount"
                        name="expenseAmt" 
                        value={Number(formData.expenseAmt).toFixed(2)} 
                        onChange={handleChange}/>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">{formData.expenseCcy}</InputGroup.Text>
                    </InputGroup.Prepend>
                </InputGroup>  
            </td>
            <td><Form.Control size="sm" type="input" maxLength={200} placeholder="Description"
                    name="expenseDesc" value={formData.expenseDesc} onChange={handleChange}/>
            </td>
            <td>
                <Form.Control size="sm" as="select" name="expenseType" placeholder="Expense Type" 
                    onChange={handleChange} value={formData.expenseType}>
                    <option key={0} value=''>Expense Type</option>
                    <ExpenseTypesDropDown></ExpenseTypesDropDown>
                </Form.Control>
            </td>
            <td>
                <Form.Check name="expenseAdj" type="checkbox" label="Adjusment" checked={formData.expenseAdj} 
                    onChange={handleChange}></Form.Check>
            </td>
            <td>
                <Button variant="primary" size="sm" onClick={handleExpenseDetailAdd}>
                {
                  formData.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Add'
                }
                </Button>
                <Form.Text className={formData.messageClass}>{formData.message}</Form.Text>
            </td>
        </tr>
    )
}

export default ExpenseDetailAddRow;