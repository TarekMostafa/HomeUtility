import React, {useState, useEffect} from 'react';
import { Form, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDown';
import EditDeleteButton from '../common/EditDeleteButton';
// import amountFormatter from '../../utilities/amountFormatter';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';
import LabelsOverlay from '../common/LabelsOverlay';

const initialState = {
    mode: 'None',
    isLoading: false,
    isDisabled: false,
    message: "",
    messageClass:"",
    expenseType: 0,
    expenseDesc: "",
}

function ExpenseDetailRow(props) {
    
    const handleSaveLabels = (id,{Label1, Label2, Label3, Label4, Label5}) => {
        setFormData({
            isLoading: true,
            isDisabled: true,
            message: "",
            messageClass:""
        });

        ExpenseDetailRequest.updateExpenseLabels(id, Label1,
            Label2, Label3, Label4,
            Label5).then( result => {
                if (typeof props.onEdit=== 'function') {
                    props.onEdit();
                }
                setFormData(initialState);
            }).catch(err => {
                setFormData({
                    isLoading: false,
                    isDisabled: false,
                    message: err.response.data,
                    messageClass: 'text-danger',
                });
            })
    }

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
            expenseDesc: elem.expenseDescription,
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

    const hasLabel = elem.expenseLabels && 
                        (elem.expenseLabels.expenseLabel1 ||
                        elem.expenseLabels.expenseLabel2 ||
                        elem.expenseLabels.expenseLabel3 ||
                        elem.expenseLabels.expenseLabel4 ||
                        elem.expenseLabels.expenseLabel5);    

    return (
        <tr key={elem.expenseDetailId} style={getRowColor(elem)}>
            <td>{props.index}</td>
            <td>
                {moment(new Date(elem.expense.expenseYear, elem.expense.expenseMonth-1, 
                    elem.expenseDay)).format('DD/MM/YYYY')}
            </td>
            <td className="text-right" style={getCellColor(elem.expenseAmount)}>
                {/* {amountFormatter(elem.expenseAmount, elem.currency.currencyDecimalPlace)} */}
                {elem.expenseAmountFormatted}
            </td>
            <td>{elem.expenseCurrency}</td>
            <td>
                {
                    formData.mode === 'Edit' ? 
                    <Form.Control size="sm" type="input" maxLength={200} placeholder="Description"
                    name="expenseDesc" value={formData.expenseDesc} 
                    onChange={(e)=>setFormData({...formData, expenseDesc:e.target.value})}/>
                    :
                    <Row>
                        <Col>
                        <OverlayTrigger placement="right"
                            delay={{ show: 250, hide: 400 }} overlay={(
                            <Tooltip>{elem.expenseDescription}</Tooltip>
                            )}>
                            <span className="textEllipsis">
                            {elem.expenseDescription}
                            </span>
                        </OverlayTrigger>
                        </Col>
                        {
                            (hasLabel || !props.readOnly) &&
                            <Col>
                                <LabelsOverlay Labels={{Label1: elem.expenseLabels.expenseLabel1,
                                    Label2: elem.expenseLabels.expenseLabel2,
                                    Label3: elem.expenseLabels.expenseLabel3,
                                    Label4: elem.expenseLabels.expenseLabel4,
                                    Label5: elem.expenseLabels.expenseLabel5
                                    }} 
                                    isLoading={formData.isLoading} 
                                    onSaveLabels={(labels)=>handleSaveLabels(elem.expenseDetailId, labels)}
                                    {...props}/>
                            </Col>
                        }
                    </Row>
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
            <td>{elem.expenseDetailId}</td>
            { !props.readOnly && 
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
            }
        </tr>
    );
}

export default ExpenseDetailRow;