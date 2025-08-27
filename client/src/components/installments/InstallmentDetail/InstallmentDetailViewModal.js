import React, {useState, useEffect} from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import InstallmentDetailRequest from '../../../axios/InstallmentDetailRequest';

const initialState = {
    isLoading: false,
    message: "",
    instDetDate: "",
    instDetAmount: 0,
    instDetStatus: "",
    instDetCheckNumber: "",
    instDetPaidDate: "",
    instDetNotes: "",
    instDetCurrency: "",
    decimalPlaces: 0,
}

function InstallmentDetailViewModal(props) {

    const [formData, setFormData] = useState(initialState);

    const loadInstallmentDetail = (id) => InstallmentDetailRequest.getInstallmentDetail(id)
        .then(  instDet => {
        if(instDet) setFormData({
            ...formData,
            instDetDate: instDet.instDetDate,
            instDetAmount: instDet.instDetAmount,
            instDetStatus: instDet.instDetStatus,
            instDetCheckNumber: instDet.instDetCheckNumber,
            instDetPaidDate: instDet.instDetPaidDate,
            instDetNotes: instDet.instDetNotes,
            instDetCurrency: instDet.instDetCurrency,
            decimalPlaces: instDet.decimalPlaces,
            message: ''
        });
    });

    useEffect(()=>{
        if(props.instDetId) loadInstallmentDetail(props.instDetId);
    },[props.instDetId])

    return (
        <ModalContainer title={props.instDetId?"View Installment Detail ("+props.instDetId+")":"View Installment Detail"}  
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}>
            <form>
                <Form.Group controlId="instDetDate">
                    <Form.Label>Installment Date</Form.Label>
                    <Form.Control type="input"
                    name="instDetDate"
                    value={moment(formData.instDetDate).format('DD/MM/YYYY')} readOnly/>
                </Form.Group>
                <Form.Group controlId="instDetAmount">
                    <Form.Label>Installment Amount</Form.Label>
                    <InputGroup>
                        <Form.Control type="number" maxLength={20}
                        name="instDetAmount"
                        value={Number(formData.instDetAmount).toFixed(formData.decimalPlaces)}
                        readOnly/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                {formData.instDetCurrency}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="instDetStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="instDetStatus" value={formData.instDetStatus} readOnly>
                        <option value=''></option>
                        <option value='UNPAID'>UNPAID</option>
                        <option value='PAID'>PAID</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="instDetCheckNumber">
                    <Form.Label>Check Number</Form.Label>
                    <Form.Control type="input" maxLength={20}
                    name="instDetCheckNumber" value={formData.instDetCheckNumber} readOnly/>
                </Form.Group>
                <Form.Group controlId="instDetPaidDate">
                    <Form.Label>Paid Date</Form.Label>
                    <Form.Control type="input"
                    name="instDetPaidDate"
                    value={formData.instDetPaidDate?moment(formData.instDetPaidDate).format('DD/MM/YYYY'):""} 
                    readOnly/>
                </Form.Group>
                <Form.Group controlId="instDetNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control type="input" maxLength={200}
                    name="instDetNotes" value={formData.instDetNotes} readOnly/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </form>
        </ModalContainer>
    );
}

export default InstallmentDetailViewModal;