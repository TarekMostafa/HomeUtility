import React, {useState, useEffect} from 'react';
import { Form, OverlayTrigger, Tooltip, Popover, Table, Row, Col, 
    Badge, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';

import ExpenseTypesDropDown from './expensetypes/ExpenseTypesDropDown';
import EditDeleteButton from '../common/EditDeleteButton';
// import amountFormatter from '../../utilities/amountFormatter';
import ExpenseDetailRequest from '../../axios/ExpenseDetailRequest';

const initialState = {
    mode: 'None',
    isLoading: false,
    isDisabled: false,
    message: "",
    messageClass:"",
    expenseType: 0,
    expenseDesc: "",
    expenseLabel1: "",
    expenseLabel2: "",
    expenseLabel3: "",
    expenseLabel4: "",
    expenseLabel5: "",
}

function ExpenseDetailRow(props) {
    
    const handleSaveLabels = (id) => {
        setFormData({
            isLoading: true,
            isDisabled: true,
            message: "",
            messageClass:""
        });

        ExpenseDetailRequest.updateExpenseLabels(id, formData.expenseLabel1,
            formData.expenseLabel2, formData.expenseLabel3, formData.expenseLabel4,
            formData.expenseLabel5).then( result => {
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
            expenseLabel1: elem.expenseLabels.expenseLabel1,
            expenseLabel2: elem.expenseLabels.expenseLabel2,
            expenseLabel3: elem.expenseLabels.expenseLabel3,
            expenseLabel4: elem.expenseLabels.expenseLabel4,
            expenseLabel5: elem.expenseLabels.expenseLabel5,
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

    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Labels</Popover.Title>
            <Popover.Content>
                <Table size="sm" responsive="sm">
                      <tbody>
                      {
                        elem.expenseLabels && Object.keys(elem.expenseLabels).map(
                          key => {
                            return(
                            <tr key={key}>
                              <td>{`Label ${key.substring(12,13)}: `}</td>
                              <td>
                                {
                                    props.readOnly ? elem.expenseLabels[key] :
                                    <Form.Control size="sm" type="input" maxLength={20} 
                                    name={key} value={formData[key]?formData[key]:""} 
                                    onChange={(e)=>setFormData({...formData, [key]:e.target.value})}/>
                                }
                              </td>
                            </tr>
                            )
                          }
                        )
                      }
                      </tbody>
                      <tfoot>
                        {
                            !props.readOnly && 
                            <tr>
                            <td colSpan={2}>
                                <Button variant="primary" block size="sm" 
                                    onClick={()=>handleSaveLabels(elem.expenseDetailId)}>
                                    {
                                        formData.isLoading?
                                        <Spinner as="span" animation="border" size="sm" role="status"
                                        aria-hidden="true"/> : 'Save'
                                    }
                                </Button>
                            </td>
                            </tr>
                        }
                      </tfoot>
                </Table>
            </Popover.Content>
        </Popover>  
    );                  

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
                            <OverlayTrigger placement="auto" overlay={popover} trigger="click">
                                <Badge variant="light">
                                    Labels
                                </Badge>
                            </OverlayTrigger>
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