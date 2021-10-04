import React, {useState} from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDOwn';

const initialState = {
    expenseDate: new Date(),
    expenseAmt: 0,
    expenseCcy: 'EGP',
    expenseDesc: '',
    expenseType: 0,
    expenseAdj: false
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

    const [formData, setFormData] = useState(initialState);

    return (
        <tr key={'AddRow'}>
            <td></td>
            <td>
                <DatePickerInput readOnly small placeholder="Expense Date" 
                value={formData.expenseDate} onChange={handleExpenseDateChange}/>
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
                <Form.Control size="sm" as="select" name="type" placeholder="Expense Type" 
                    onChange={handleChange}>
                    <option key={0} value=''>Expense Type</option>
                </Form.Control>
            </td>
            <td>
                <Form.Check name="expenseAdj" type="checkbox" label="Adjusment" value={formData.expenseAdj} 
                    onChange={handleChange}></Form.Check>
            </td>
            <td><Button variant="primary" size="sm">Add</Button></td>
        </tr>
    )
}

export default ExpenseDetailAddRow;