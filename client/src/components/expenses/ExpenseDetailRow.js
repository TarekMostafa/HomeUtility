import React, {useState} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../utilities/amountFormatter';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

const initialState = {
    isLoading: false,
    message: ""
}

function ExpenseDetailRow(props) {

    const handleExpenseDetailDelete = (id) => {

        setFormData({
            isLoading: true,
            message: ""
        });

        ExpenseDetailRequest.deleteExpenseDetail(id)
        .then( (result) => {
            if (typeof props.onDelete=== 'function') {
                props.onDelete();
            }
            setFormData({
                isLoading: false,
                message: result.data
            });
        })
        .catch( err => {
            setFormData({
                isLoading: false,
                message: err.response.data
            });
        })
    }

    const getCellColor = (amount) => {
        if(amount < 0)  return {color:'#ff0000'};
    }

    const getRowColor = (expense) => {
        if(expense.expenseAdjusment) return {color:'#0020ff'};
    }

    const [formData, setFormData] = useState({...initialState});

    const elem = props.expenseDetail;

    return (
        <tr key={elem.expenseDetailId} style={getRowColor(elem)}>
            <td>{elem.expenseDetailId}</td>
            <td>
                {moment(new Date(elem.expense.expenseYear, elem.expense.expenseMonth-1, 
                    elem.expenseDay)).format('DD/MM/YYYY')}
            </td>
            <td className="text-right" style={getCellColor(elem.expenseAmount)}>
                {amountFormatter(elem.expenseAmount, elem.currency.currencyDecimalPlace)}
            </td>
            <td>{elem.expenseCurrency}</td>
            <td>{elem.expenseDescription}</td>
            <td>{(elem.expenseType?elem.expenseType.expenseTypeName:"")}</td>
            <td>{elem.expenseAdjusment?'YES':'NO'}</td>
            <td>
                <Button variant="danger" size="sm" onClick={()=>handleExpenseDetailDelete(elem.expenseDetailId)}>
                {
                    formData.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Delete'
                }
                </Button>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </td>
        </tr>
    );
}

export default ExpenseDetailRow;