import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../common/ModalContainer';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import InstallmentRequest from '../../axios/InstallmentRequest';

const initialState = {
    isLoading: false,
    message: "",
    instName: "",
    instStartDate: "",
    instEndDate: "",
    instAmount: 0,
    instPaid: 0,
    instCurrency: "",
    instNotes: "",
    decimalPlaces: 0,
}

function InstallmentDeleteModal(props) {

    const [formData, setFormData] = useState(initialState);

    const loadInstallment = (id) => InstallmentRequest.getInstallment(id)
        .then(  inst => {
        if(inst) setFormData({
            ...formData,
            instName: inst.instName,
            instStartDate: inst.instStartDate,
            instEndDate: inst.instEndDate,
            instAmount: inst.instAmountFormatted,
            instCurrency: inst.instCurrency,
            instNotes: inst.instNotes,
            instEntered: inst.instEnteredAmountFormatted,
            instPaid: inst.instPaidAmountFormatted,
            decimalPlaces: inst.decimalPlaces,
            message: ''
        });
    });

    useEffect(()=>{
        if(props.instId) loadInstallment(props.instId);
    },[props.instId])

    const handleClick = () => {

        setFormData({
            ...formData,
            message: '',
            isLoading: true,
        });
    
        InstallmentRequest.deleteInstallment(props.instId)
        .then( () => {
            if (typeof props.onDelete=== 'function') {
                props.onDelete();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    return (
        <ModalContainer title={props.instId?"Delete Installment ("+props.instId+")":"Delete Installment"} 
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}
            footer={
                <Button variant="danger" block onClick={handleClick}>
                  {
                    formData.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Delete'
                  }
                </Button>
        }>
            <form>
                <Form.Group controlId="instName">
                    <Form.Label>Installment Name</Form.Label>
                    <Form.Control type="input"
                    name="instName" value={formData.instName} readOnly/>
                </Form.Group>
                <Form.Group controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="input"
                    name="instStartDate"
                    value={moment(formData.instStartDate).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
                <Form.Group controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="input"
                    name="instEndDate"
                    value={moment(formData.instEndDate).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
                <Form.Group controlId="instAmount">
                    <Form.Label>Total Amount</Form.Label>
                    <InputGroup>
                        <Form.Control type="input"
                        name="instAmount"
                        value={formData.instAmount}
                        readOnly/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                {formData.instCurrency}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="instEntered">
                    <Form.Label>Entered</Form.Label>
                    <InputGroup>
                        <Form.Control type="input"
                        name="instEntered"
                        value={formData.instEntered}
                        readOnly/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                {formData.instCurrency}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="instPaid">
                    <Form.Label>Paid</Form.Label>
                    <InputGroup>
                        <Form.Control type="input"
                        name="instPaid"
                        value={formData.instPaid}
                        readOnly/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                {formData.instCurrency}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="instNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control type="input"
                    name="instNotes" value={formData.instNotes} readOnly/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </form>
        </ModalContainer>
    );
}

export default InstallmentDeleteModal;