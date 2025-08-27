import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

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

function InstallmentDetailEditModal(props) {

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

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name] : event.target.value
        });
    }

    const handleInstDateChange = (jsDate, date) => {
        setFormData({
            ...formData,
            instDetDate: date
        });
    }

    const handlePaidDateChange = (jsDate, date) => {
        setFormData({
            ...formData,
            instDetPaidDate: date
        });
    }

    const handleClick = () => {
        // Validate Input
        if(!formData.instDetDate) {
            setFormData({...formData, message: 'Invalid installment date, should not be empty'});
            return;
        } else if(!formData.instDetAmount) {
            setFormData({...formData, message: 'Invalid amount, should not be zero'});
            return;
        } else if(!formData.instDetStatus) {
            setFormData({...formData, message: 'Invalid status, should not be empty'});
            return;
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }
    
        InstallmentDetailRequest.updateInstallmentDetail(props.instDetId, formData.instDetDate, 
            formData.instDetAmount, formData.instDetStatus, formData.instDetCheckNumber, 
            formData.instDetPaidDate, formData.instDetNotes
        )
        .then( () => {
            if (typeof props.onSave=== 'function') {
                props.onSave();
            }
            setFormData({...formData, isLoading: false});
            props.onHide();
        })
        .catch( err => {
            setFormData({...formData, message: err.response.data, isLoading: false});
        })
    }

    return (
        <ModalContainer title={props.instDetId?"Edit Installment Detail ("+props.instDetId+")":"Edit Installment Detail"}  
        show={props.show} onHide={props.onHide} onShow={() => setFormData(initialState)}
            footer={
                <Button variant="primary" block onClick={handleClick}>
                  {
                    formData.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Save'
                  }
                </Button>
        }>
            <form>
                <Form.Group controlId="instDetDate">
                    <Form.Label>Installment Date</Form.Label>
                    <DatePickerInput value={formData.instDetDate}
                    onChange={handleInstDateChange} readOnly/>
                </Form.Group>
                <Form.Group controlId="instDetAmount">
                    <Form.Label>Installment Amount</Form.Label>
                    <InputGroup>
                        <Form.Control type="number" maxLength={20}
                        name="instDetAmount"
                        value={Number(formData.instDetAmount).toFixed(formData.decimalPlaces)}
                        onChange={handleChange}/>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                {formData.instDetCurrency}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="instDetStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="instDetStatus" 
                    value={formData.instDetStatus} onChange={handleChange}>
                        <option value=''></option>
                        <option value='UNPAID'>UNPAID</option>
                        <option value='PAID'>PAID</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="instDetCheckNumber">
                    <Form.Label>Check Number</Form.Label>
                    <Form.Control type="input" maxLength={20}
                    name="instDetCheckNumber" value={formData.instDetCheckNumber} onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="instDetPaidDate">
                    <Form.Label>Paid Date</Form.Label>
                    <DatePickerInput value={formData.instDetPaidDate}
                    onChange={handlePaidDateChange} readOnly/>
                </Form.Group>
                <Form.Group controlId="instDetNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control type="input" maxLength={200}
                    name="instDetNotes" value={formData.instDetNotes} onChange={handleChange}/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </form>
        </ModalContainer>
    );
}

export default InstallmentDetailEditModal;