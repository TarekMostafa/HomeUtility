import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDown';
import EditDeleteButton from '../common/EditDeleteButton';
import amountFormatter from '../../utilities/amountFormatter';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

const initialState = {
    mode: 'None',
    isLoading: false,
    isDisabled: false,
    message: "",
    messageClass:"",
    expenseType: 0,
    expenseDesc: ""
}

function ExpenseDetailRow(props) {
    
    const handleExpenseDetailDelete = (id) => {
        if(formData.mode === 'Delete') {
            setFormData({
                isLoading: true,
                isDisabled: true,
                message: "",
                messageClass:""
            });

            ExpenseDetailRequest.deleteExpenseDetail(id)
            .then( (result) => {
                if (typeof props.onDelete=== 'function') {
                    props.onDelete();
                }
                setFormData(initialState);
            })
            .catch( err => {
                setFormData({
                    isLoading: false,
                    isDisabled: false,
                    message: err.response.data,
                    messageClass: 'text-danger',
                });
            })
        } else { 
            setFormData({
                ...formData,
                mode: 'Delete',
                message: '',
                messageClass: ''
            })
        }
    }

    const handleExpenseDetailEdit = (id) => {
        if(formData.mode === 'Edit') {
            setFormData({
                isLoading: true,
                isDisabled: true,
                message: "",
                messageClass:""
            });

            ExpenseDetailRequest.updateExpenseDetail(id, 
                formData.expenseType, formData.expenseDesc)
            .then( (result) => {
                if (typeof props.onEdit=== 'function') {
                    props.onEdit();
                }
                setFormData(initialState);
            })
            .catch( err => {
                setFormData({
                    isLoading: false,
                    isDisabled: false,
                    message: err.response.data,
                    messageClass: 'text-danger',
                });
            })
        } else { 
            setFormData({
                ...formData,
                mode: 'Edit',
                message: '',
                messageClass: ''
            })
        }
    }

    const initializeFormData = () => {
        setFormData({
            ...initialState,
            expenseType: elem.expenseTypeId,
            expenseDesc: elem.expenseDescription
        })
    }

    const elem = props.expenseDetail;
    const [formData, setFormData] = useState(initialState);

    useEffect(()=>{
        initializeFormData();
    },[props.expenseDetail])
    
    const getCellColor = (amount) => {
        if(amount < 0)  return {color:'#ff0000'};
    }

    const getRowColor = (expense) => {
        if(expense.expenseAdjusment) return {color:'#0020ff'};
    }

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
            <td>
                {
                    formData.mode === 'Edit' ? 
                    <Form.Control size="sm" type="input" maxLength={200} placeholder="Description"
                    name="expenseDesc" value={formData.expenseDesc} 
                    onChange={(e)=>setFormData({...formData, expenseDesc:e.target.value})}/>
                    :elem.expenseDescription
                }
            </td>
            <td>
                {   formData.mode === 'Edit' ? 
                    <Form.Control size="sm" as="select" name="expenseType" placeholder="Expense Type" 
                    onChange={(e)=>setFormData({...formData, expenseType:e.target.value})} 
                    value={formData.expenseType} disabled={elem.expenseAdjusment}>
                        <option key={0} value=''>Expense Type</option>
                        <ExpenseTypesDropDown></ExpenseTypesDropDown>
                    </Form.Control>
                    : (elem.expenseType?elem.expenseType.expenseTypeName:"")
                }
            </td>
            <td>{elem.expenseAdjusment?'YES':'NO'}</td>
            <td>
                <EditDeleteButton 
                    onEditClick={()=>handleExpenseDetailEdit(elem.expenseDetailId)}
                    onDeleteClick={()=>handleExpenseDetailDelete(elem.expenseDetailId)}
                    onCancelClick={()=>initializeFormData()}
                    disabled={formData.isDisabled}
                    isLoading={formData.isLoading}
                    mode={formData.mode}/>
                <Form.Text className={formData.messageClass}>{formData.message}</Form.Text>
            </td>
        </tr>
    );
}

export default ExpenseDetailRow;