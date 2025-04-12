import React, {useState} from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import LabelDropDown from '../../common/LabelDropDown';

import LabelTransactionTable from './LabelTransactionTable';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
    label: '',
    currency: '',
    dateFrom: '',
    dateTo: '',
    message: '',
    headers: ['Date From', 'Date To'],
    rows: [],
    isLoading: false,
}

function LabelTransactionList () {

    const [formData, setFormData] = useState(initialState);

    const handleChange = (event) => {

        if(formData.rows.length > 0) return;

        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleDateFromChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateFrom: date
        });
    }
    
    const handleDateToChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateTo: date
        });
    }

    const handleAddClick = () => {
        if(!formData.label) {
            setFormData({
                ...formData,
                message: 'Invalid label, should not be empty'
            });
            return;
        } else if(!formData.currency) {
            setFormData({
                ...formData,
                message: 'Invalid currency, should not be empty'
            });
            return;
        } else if(!formData.dateFrom) {
            setFormData({
                ...formData,
                message: 'Invalid posting date from, should not be empty'
            });
            return;
        } else if(!formData.dateTo) {
            setFormData({
                ...formData,
                message: 'Invalid posting date to, should not be empty'
            });
            return;
        } else if (formData.dateFrom > formData.dateTo) {
            setFormData({
                ...formData,
                message: 'Posting date from must be less than or equal to Posting date to'
            });
            return;
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }
        // Get Label Statistics
        TransactionRequest.getLabelStatistics(formData.label,
            formData.currency, formData.dateFrom, formData.dateTo)
        .then( (result) => {

            let headers = [...formData.headers]
            let row = [];
            row[0] = result.dateFrom;
            row[1] = result.dateTo;
            for(const details of result.details) {
                if(!headers.includes(details.label)) headers.push(details.label);
                const index = headers.indexOf(details.label);
                row[index] = details.totalFormatted;
            }
            //fill gaps
            for(let counter =0; counter <headers.length; counter++){
                if(!row[counter]) row[counter] = 0;
            }
            const rows = [...formData.rows, row];

            setFormData({
                ...formData,
                headers,
                rows,
                isLoading: false
            });
        })
        .catch( err => {
            setFormData({
                ...formData,
                message: err.response.data,
                isLoading: false,
            })
        })
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    return (
        <React.Fragment>
            <FormContainer title="Label Transactions Statistics">
                <Form>
                    <Row>
                        <Col>
                        <Form.Control as="select" size="sm" name="label" 
                            onChange={handleChange}
                            value={formData.label} readOnly={formData.rows.length > 0}>
                            <option value=''>Label</option>
                            <LabelDropDown />
                        </Form.Control> 
                        </Col>
                        <Col>
                        <Form.Control as="select" size="sm" name="currency" 
                            onChange={handleChange}
                            value={formData.currency} readOnly={formData.rows.length > 0}>
                            <option value=''>Currency</option>
                            <CurrenciesDropDown />
                        </Form.Control>                           
                        </Col>
                        <Col>
                        <DatePickerInput value={formData.dateFrom}
                            onChange={handleDateFromChange} readOnly 
                            placeholder="Posting Date From" small/>
                        </Col>
                        <Col>
                        <DatePickerInput value={formData.dateTo}
                            onChange={handleDateToChange} readOnly 
                            placeholder="Posting Date From" small/>
                        </Col>
                        <Col xs={1}>
                        <Button variant="primary" size="sm" block onClick={handleAddClick}>
                        {
                            formData.isLoading?
                            <Spinner as="span" animation="border" size="sm" role="status"
                            aria-hidden="true"/> : 'Run/Add'
                        }
                        </Button>
                        </Col>
                        <Col xs={1}>
                        <Button variant="secondary" size="sm" block onClick={handleResetClick}>
                            Reset</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Form.Text className='text-danger'>{formData.message}</Form.Text>
                        </Col>
                    </Row>  
                </Form>
            </FormContainer>
            <FormContainer>
                <LabelTransactionTable headers={formData.headers} rows={formData.rows}/>
            </FormContainer>
        </React.Fragment>
    );
}

export default LabelTransactionList;