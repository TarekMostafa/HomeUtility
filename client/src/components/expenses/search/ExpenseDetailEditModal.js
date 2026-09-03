import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup, Col } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import ExpenseTypesDropDown from '../expensetypes/ExpenseTypesDropDown';
import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';

const initialState = {
    expenseDate: '',
    expenseAmt: '',
    expenseCurrency: '',
    expenseDesc: '',
    expenseType: 0,
    expenseAdj: false,
    isLoading: false,
    message: "",
}

function ExpenseDetailEditModal(props) {
    const [formData, setFormData] = useState(initialState);
    const [expenseDetail, setExpenseDetail] = useState(null);

    const loadExpenseDetail = (id) => ExpenseDetailRequest.getExpenseDetail(id)
        .then(  expenseDetail => {
            setExpenseDetail(expenseDetail);
            if(expenseDetail) setFormData({
                ...formData,
                expenseDate: expenseDetail.expenseDate,
                expenseAmt: expenseDetail.expenseAmountFormatted,
                expenseCurrency: expenseDetail.expenseCurrency,
                expenseDesc: expenseDetail.expenseDescription,
                expenseType: expenseDetail.expenseTypeId,
                expenseAdj: expenseDetail.expenseAdjusment,
                message: ''
            });
        });
    
    useEffect(()=>{
        if(props.expenseDetailId) loadExpenseDetail(props.expenseDetailId);
    },[props.expenseDetailId])

    const handleClick = () => {
        setFormData({
            ...formData,
            message: '',
            isLoading: true,
        });

        // update expense detail
        ExpenseDetailRequest.updateExpenseDetail(props.expenseDetailId, 
            formData.expenseType, formData.expenseDesc)
        .then( (response) => {
            if (typeof props.onSave=== 'function') {
                props.onSave();
            }
            setFormData({
                ...formData,
                isLoading: false,
            });
            props.onHide();
        })
        .catch( err => {
            setFormData({
                ...formData,
                message: err.response.data,
                isLoading: false,
            });
        })
    }

    const handleChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name] : event.target.value
      });
    }

    return (
        <ModalContainer title={'Edit Expense Detail (' + props.expenseDetailId + ')'} show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
            <Button variant="primary" block onClick={handleClick}>
            {
                formData.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : 'Save'
            }
            </Button>
        }>
            <Form>
                <Form.Group controlId="expDetDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="input"
                        name="expenseDate" value={moment(formData.expenseDate).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                        <Form.Control type="input"
                            name="amount"
                            value={formData.expenseAmt}
                            readOnly/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">{formData.expenseCurrency}</InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="input" maxLength={200}
                        name="expenseDesc" value={formData.expenseDesc} onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="expenseType">
                    <Form.Label>Expense Type</Form.Label>
                    <Form.Control as="select" name="expenseType" onChange={handleChange}
                        value={formData.expenseType}>
                        <option value=''></option>
                        <ExpenseTypesDropDown />
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="adjusment">
                    <Form.Label>Adjusment</Form.Label>
                    <Form.Control type="input" maxLength={3}
                        name="adjusment" value={formData.expenseAdj?'YES':'NO'} readOnly/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </Form>
        </ModalContainer>
    )
}

export default ExpenseDetailEditModal;