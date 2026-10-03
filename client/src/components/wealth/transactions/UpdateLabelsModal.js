import React, {useState} from 'react';
import { Button, Alert, Spinner, InputGroup, Form, Row, Col } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import WealthTransactionTable from './WealthTransactionTable';
import LabelDropDown from '../../common/LabelDropDown';

import TransactionRequest from '../../../axios/TransactionRequest';

function UpdateLabelsModal({selectedTransactions, show, onHide, onUpdate}) {

    const [formData, setFormData] = useState({labelNumber: '', labelValue: '', forceUpdate: false});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({text: '', variant: ''});

    const handleChange = (event) => {
        if(event.target.name==='labelNumber' && event.target.value===' ') {
            setFormData({
                ...formData,
                labelValue: ''
            });
        }

        if(event.target.name==='labelValue') {
            const alphanumericWithUnderscore = /^[a-zA-Z0-9_]*$/;
            if(alphanumericWithUnderscore.test(event.target.value)) {
                setFormData({
                    ...formData,
                    labelValue : event.target.value.toUpperCase()
                })
            }
        } else {
            setFormData({
                ...formData,
                [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
            })
        }
    }

    const handleClick = () => {
        //Validate Input
        if(!formData.labelNumber.trim()) {
            setMessage({text:'Invalid Label, please select one', variant:"text-danger"});
            return;
        } else {
            setMessage({text: '', variant: ''});
            setIsLoading(true);
        }

        //Update Labels
        TransactionRequest.updateBulkTransactionLabel(
            selectedTransactions.map(t => t.transactionId),
            formData.labelNumber, formData.labelValue, formData.forceUpdate)
            .then( response => {
                if (typeof onUpdate=== 'function') {
                    onUpdate();
                }
                setIsLoading(false);
                setMessage({text:`Number of updated records is ${response.numberOfUpdated}`, variant:'text-info'});
            })
            .catch( err => {
                setIsLoading(false);
                setMessage({text: err.response.data, variant: 'text-danger'});
            });
    }

    const getModalFooter = () => {
        if(selectedTransactions && selectedTransactions.length > 0) {
            return (
                <Button variant="primary" block onClick={handleClick}>
                {
                    isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Update'
                }
                </Button>
            );
        } else {
            return null;
        }
    }

    return (
        <ModalContainer title="Update Labels" show={show}
        onHide={onHide} size='xl' footer={getModalFooter()}>
        {
            (selectedTransactions && selectedTransactions.length > 0) ?
            <>
            <Row>
                <Col xs={9}>
                <InputGroup className="mb-3">
                    <Form.Control as="select" size="sm" name="labelNumber" 
                        onChange={handleChange}
                        value={formData.labelNumber}>
                        <option key=' ' value=' '>Labels</option>
                        <LabelDropDown />
                    </Form.Control>
                    <Form.Control type="input" placeholder="Transaction Label" size="sm" name="labelValue"
                    onChange={handleChange} value={formData.labelValue} maxLength={20}/>
                </InputGroup>
                </Col>
                <Col xs={3}>
                    <Form.Check type="checkbox" 
                    onChange={handleChange}
                    checked={formData.forceUpdate}
                    name="forceUpdate"
                    id="forceUpdate" label="Replacing existing data" />
                </Col>
            </Row>
            <Row>
                <Col>
                <WealthTransactionTable transactions={selectedTransactions} />
                </Col>
            </Row>
            <Row>
                <Col>
                <Form.Text className={message.variant}>{message.text}</Form.Text>
                </Col>
            </Row>
            </>
            :           
            <Alert variant="danger" className="text-center">
                There is no selected transactions, please select one or more transactions to update their labels
            </Alert>
        } 
        </ModalContainer>
    )
}

export default UpdateLabelsModal;