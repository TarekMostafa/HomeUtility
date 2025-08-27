import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

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
    instCurrency: "",
    instStatus: "",
    instNotes: "",
    decimalPlaces: 0,
}

function InstallmentEditModal(props) {

    const [formData, setFormData] = useState(initialState);

    const loadInstallment = (id) => InstallmentRequest.getInstallment(id)
        .then(  inst => {
        if(inst) setFormData({
            ...formData,
            instName: inst.instName,
            instStartDate: inst.instStartDate,
            instEndDate: inst.instEndDate,
            instAmount: inst.instAmount,
            instCurrency: inst.instCurrency,
            instStatus: inst.instStatus,
            instNotes: inst.instNotes,
            decimalPlaces: inst.decimalPlaces,
            message: ''
        });
    });

    useEffect(()=>{
        if(props.instId) loadInstallment(props.instId);
    },[props.instId])

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name] : event.target.value
        });
    }

    const handleStartDateChange = (jsDate, date) => {
        setFormData({
            ...formData,
            instStartDate: date
        });
    }

    const handleEndDateChange = (jsDate, date) => {
        setFormData({
            ...formData,
            instEndDate: date
        });
    }

    const handleCurrencyChange = (event) => {
        const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
        setFormData({
            ...formData,
            instCurrency : event.target.value,
            decimalPlaces
        });
    }

    const handleClick = () => {
        // Validate Input
        if(!formData.instName) {
            setFormData({...formData, message: 'Invalid installment name, should not be empty'});
            return;
        } else if(!formData.instStartDate) {
            setFormData({...formData, message: 'Invalid start date, should not be empty'});
            return;
        } else if(!formData.instEndDate) {
            setFormData({...formData, message: 'Invalid end date, should not be empty'});
            return;
        } else if(formData.instStartDate > formData.instEndDate) {
            setFormData({...formData, message: 'Invalid dates, start date should be before end date'});
            return;
        } else if(!formData.instCurrency) {
            setFormData({...formData, message: 'Invalid currency, should not be empty'});
            return;
        } else if(!formData.instAmount) {
            setFormData({...formData, message: 'Invalid amount, should not be zero'});
            return;
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }
    
        InstallmentRequest.updateInstallment(props.instId, formData.instName, formData.instCurrency, 
            formData.instStartDate, formData.instEndDate, formData.instAmount, formData.instStatus,
            formData.instNotes
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
        <ModalContainer title={props.instId?"Edit Installment ("+props.instId+")":"Edit Installment"} 
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
                <Form.Group controlId="instName">
                    <Form.Label>Installment Name</Form.Label>
                    <Form.Control type="input" maxLength={50}
                    name="instName" value={formData.instName} onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <DatePickerInput value={formData.instStartDate}
                    onChange={handleStartDateChange} readOnly/>
                </Form.Group>
                <Form.Group controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <DatePickerInput value={formData.instEndDate}
                    onChange={handleEndDateChange} readOnly/>
                </Form.Group>
                <Form.Group controlId="instCurrency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control as="select" name="instCurrency" value={formData.instCurrency} 
                    onChange={handleCurrencyChange}>
                        <option value=''></option>
                        <CurrenciesDropDown />
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="instAmount">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control type="number" maxLength={20}
                    name="instAmount"
                    value={Number(formData.instAmount).toFixed(formData.decimalPlaces)}
                    onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="instStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="instStatus" 
                    value={formData.instStatus} onChange={handleChange}>
                        <option value=''></option>
                        <option value='ACTIVE'>ACTIVE</option>
                        <option value='CLOSED'>CLOSED</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="instNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control type="input" maxLength={200}
                    name="instNotes" value={formData.instNotes} onChange={handleChange}/>
                </Form.Group>
                <Form.Text className='text-danger'>{formData.message}</Form.Text>
            </form>
        </ModalContainer>
    );
}

export default InstallmentEditModal;