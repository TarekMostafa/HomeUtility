import React, {useState, useEffect} from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import TransactionRequest from '../../../axios/TransactionRequest';

const initialState = {
    isLoading: false,
    message: "",
    label1: "",
    label2: "",
    label3: "",
    label4: "",
    label5: "",
}

function AddTransactionLabels(props) {

    const [formData, setFormData] = useState(initialState);

    const loadLabels = (labels) => {
        setFormData({
            ...formData,
            label1: labels.label1,
            label2: labels.label2,
            label3: labels.label3,
            label4: labels.label4,
            label5: labels.label5,
        });
    }

    useEffect(()=>{
        if(props.labels) loadLabels(props.labels);
    },[props.labels])

    const handleChange = (event) => {

        const alphanumericWithUnderscore = /^[a-zA-Z0-9_]*$/;

        if(alphanumericWithUnderscore.test(event.target.value)) {
            setFormData({
                ...formData,
                [event.target.name] : event.target.value.toUpperCase()
            })
        }
    }

    const handleClick = () => {
        setFormData({
            ...formData,
            isLoading : true,
            message: '',
        })

        TransactionRequest.updateTransactionLabels(props.transactionId, 
            formData.label1, formData.label2, formData.label3,
            formData.label4, formData.label5
        ).then( response => {
            setFormData({
                ...formData,
                isLoading : false,
                message: '',
            })
        }).catch( err => {
            setFormData({
                ...formData,
                isLoading : false,
                message: err.response.data,
            })
        })
    }

    return (
        <React.Fragment>
             <FormContainer title="" >
                <Form>
                    <Form.Group as={Row} controlId="label1">
                        <Form.Label column sm="2">Label 1</Form.Label>
                        <Col sm="10">
                            <Form.Control type="input" maxLength={20}
                            name="label1" value={formData.label1} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="label2">
                        <Form.Label column sm="2">Label 2</Form.Label>
                        <Col sm="10">
                            <Form.Control type="input" maxLength={20}
                            name="label2" value={formData.label2} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="label3">
                        <Form.Label column sm="2">Label 3</Form.Label>
                        <Col sm="10">
                            <Form.Control type="input" maxLength={20}
                            name="label3" value={formData.label3} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="label4">
                        <Form.Label column sm="2">Label 4</Form.Label>
                        <Col sm="10">
                            <Form.Control type="input" maxLength={20}
                            name="label4" value={formData.label4} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="label5">
                        <Form.Label column sm="2">Label 5</Form.Label>
                        <Col sm="10">
                            <Form.Control type="input" maxLength={20}
                            name="label5" value={formData.label5} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Text className='text-danger'>{formData.message}</Form.Text>
                </Form>
                <Button variant="info" block onClick={handleClick}>
                {
                    formData.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                        aria-hidden="true"/> : 'Save'
                }
                </Button>
            </FormContainer>
        </React.Fragment>
    );
}

export default AddTransactionLabels;