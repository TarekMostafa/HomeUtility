import React, {useState} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import BillDropDown from '../../bills/summary/BillsDropDown';
import ExpenseTypesDropDown from '../expensetypes/ExpenseTypesDropDown';

import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';

const initialState = {
    bill: '',
    message: '',
    isLoading: false,
}

function AddExpenseDetailToBillTransactionModal(props) {

    const data = props.expenseDetail;
    const [formData, setFormData] = useState(initialState);

    const handleOnShow = () => {
        setFormData(initialState);
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
        })
    }

    const handleClick = () => {
        // Validate Input
        if(!formData.bill) {
            setFormData({
                ...formData,
                message: 'Invalid bill, should not be empty'
            });
            return;
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }

        // add expense detail to bill transaction
        ExpenseDetailRequest.addTransactionToBillTransaction(
            data.expenseDetailId, formData.bill)
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

    return (
        <ModalContainer title="Add Expense Detail To Bill Transaction" show={props.show}
            onHide={props.onHide} onShow={handleOnShow}
            footer={
                <Button variant="primary" block onClick={handleClick}>
                {
                    formData.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Add to Bill Transaction'
                }
                </Button>
            }>
            <Form>
                <Form.Group controlId="bills">
                    <Form.Label>Bill</Form.Label>
                    <Form.Control as="select" name="bill" onChange={handleChange}
                    value={formData.bill}>
                        <option value=''></option>
                        <BillDropDown status="ACTIVE"/>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="expDetDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="input"
                    name="expDetDate" value={moment(new Date(data.expense.expenseYear, data.expense.expenseMonth-1, 
                                        data.expenseDay)).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                        <Form.Control type="input"
                        name="amount"
                        value={data.expenseAmountFormatted}
                        readOnly/>
                        <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">{data.expenseCurrency}</InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Narrative</Form.Label>
                    <Form.Control type="input" maxLength={200}
                    name="description" value={data.expenseDescription} readOnly/>
                </Form.Group>
                <Form.Group controlId="expenseType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control as="select" name="expenseType" readOnly
                        value={data.expenseTypeId}>
                        <option value=''></option>
                        <ExpenseTypesDropDown />
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="adjusment">
                    <Form.Label>Adjusment</Form.Label>
                    <Form.Control type="input" maxLength={3}
                    name="adjusment" value={data.expenseAdjusment?'YES':'NO'} readOnly/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </Form>
        </ModalContainer>
    );
}

export default AddExpenseDetailToBillTransactionModal;