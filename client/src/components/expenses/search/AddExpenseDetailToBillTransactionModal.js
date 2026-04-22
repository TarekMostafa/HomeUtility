import React, {useState} from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import BillDropDown from '../../bills/summary/BillsDropDown';
import ExpenseTypesDropDown from '../expensetypes/ExpenseTypesDropDown';
import BillTransactionListModal from '../../bills/transactions/BillTransactionListModal';

import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';

const initialState = {
    bill: '',
    billTransId: 0,
    message: '',
    isLoading: false,
}

function AddExpenseDetailToBillTransactionModal(props) {

    const data = props.expenseDetail;
    const [formData, setFormData] = useState(initialState);
    const [modalBillSearchShow, setModalBillSearchShow] = useState(false);

    const handleOnShow = () => {
        setFormData(initialState);
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
        })
    }

    const handleHide = () => {
        setFormData({
            ...formData,
            billTransId: 0,
            isLoading: false,
        });

        setModalBillSearchShow(false);
    }

    const handleSearchClick = () => {
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
            });
        }

        setModalBillSearchShow(true);
    }
    
    const handleSelectClick = (transId) => {
        setFormData({
            ...formData,
            billTransId: transId,
            isLoading: false,
        });

        setModalBillSearchShow(false);
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
            data.expenseDetailId, formData.bill, formData.billTransId)
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

    const getDebitOrCredit = () => {
        if (data.expenseAdjusment) {
            return (data.expenseAmount > 0? "Credit":"Debit");
        } else {
            return (data.expenseAmount > 0? "Debit":"Credit");
        }
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
                <Row>
                    <Col xs={9}>
                        <Form.Group controlId="bills">
                            <Form.Label>Bill</Form.Label>
                            <Form.Control as="select" name="bill" onChange={handleChange}
                            value={formData.bill}>
                                <option value=''></option>
                                <BillDropDown status="ACTIVE"/>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form>
                            <Form.Group controlId="billTransId">
                            <Form.Label>Bill Trans. Id</Form.Label>
                            <InputGroup>
                                <Form.Control type="input"
                                name="billTransId"
                                value={formData.billTransId}
                                readOnly/>
                                <InputGroup.Prepend>
                                <Button variant="secondary" onClick={handleSearchClick}>...</Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
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
            {
                modalBillSearchShow && 
                <BillTransactionListModal show={modalBillSearchShow} onHide={handleHide}
                onSelect={handleSelectClick} bill={formData.bill} amountType={getDebitOrCredit()}/>
            }
        </ModalContainer>
    );
}

export default AddExpenseDetailToBillTransactionModal;