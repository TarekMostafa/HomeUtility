import React, {useState} from 'react';
import { Form, InputGroup, Button, Spinner, Row, Col } from 'react-bootstrap';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDown';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

const initialState = {
    expenseDate: '',
    expenseAmt: 0,
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
            [event.target.name] : event.target.value
        })
    }

    const handleChangeAdj = (event) => {
        setFormData({
            ...formData,
            expenseAdj: event.target.checked,
            expenseType: (event.target.checked? null: formData.expenseType)
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
            setFormData({...formData, messageClass:'text-danger', message:"Invalid date"});
            return;
        } else if(!formData.expenseAmt) {
            setFormData({...formData, messageClass:'text-danger', message:"Invalid amount"});
            return;
        } else if(!formData.expenseDesc) {
            setFormData({...formData, messageClass:'text-danger', message:"Invalid description"});
            return;
        } else if(!formData.expenseType && !formData.expenseAdj) {
            setFormData({...formData, messageClass:'text-danger', message:"Invalid expense type"});
            return;
        } else {
            setFormData({...formData, messageClass:'', message: "", isLoading: true});
        }
        ExpenseDetailRequest.addExpenseDetail(
            props.expense.expenseId, 
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
                message: 'Ok',
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

    const [formData, setFormData] = useState(initialState);

    return (
        <tr key={'AddRow'}>
            <td></td>
            <td>
                <DatePickerInput readOnly small placeholder="Expense Date" 
                value={formData.expenseDate} onChange={handleExpenseDateChange}
                minDate={new Date(props.expense.expenseYear, props.expense.expenseMonth-1, 1)}
                maxDate={new Date(props.expense.expenseYear, props.expense.expenseMonth-1, 31)}
                />
            </td>
            <td colSpan='2'>
                <InputGroup size="sm">
                    <Form.Control size="sm" type="number" placeholder="Amount"
                        name="expenseAmt" 
                        value={Number(formData.expenseAmt).toFixed(props.expense.currency.currencyDecimalPlace)} 
                        onChange={handleChange}/>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">{props.expense.expenseCurrency}</InputGroup.Text>
                    </InputGroup.Prepend>
                </InputGroup>  
            </td>
            <td><Form.Control size="sm" type="input" maxLength={200} placeholder="Description"
                    name="expenseDesc" value={formData.expenseDesc} onChange={handleChange}/>
            </td>
            <td>
                <Form.Control size="sm" as="select" name="expenseType" placeholder="Expense Type" 
                    onChange={handleChange} value={formData.expenseType} disabled={formData.expenseAdj}>
                    <option key={0} value=''>Expense Type</option>
                    <ExpenseTypesDropDown></ExpenseTypesDropDown>
                </Form.Control>
            </td>
            <td>
                <Form.Check name="expenseAdj" type="checkbox" label="Adjusment" checked={formData.expenseAdj} 
                    onChange={handleChangeAdj}></Form.Check>
            </td>
            <td></td>
            <td>
                <Row>
                <Col xs={4}><Button variant="primary" size="sm" onClick={handleExpenseDetailAdd}>
                {
                  formData.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Add'
                }
                </Button></Col>
                <Col xs={8}><Form.Text className={formData.messageClass}>{formData.message}</Form.Text></Col>
                </Row>
            </td>
        </tr>
    )
}

export default ExpenseDetailAddRow;