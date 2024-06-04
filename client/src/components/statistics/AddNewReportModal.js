import React, {useState}  from 'react';
import { Form, Row, Col, Button, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../common/ModalContainer';
import TransactionTypesChips from '../wealth/transactiontypes/TransactionTypesChips';
import ReportRequest from '../../axios/ReportRequest';

const initialState = {
    reportName: "",
    creditTransTypes: [],
    debitTransTypes: [],
    isLoading: false,
    message: "",
}

function AddNewReportModal ({transactionTypes, show, onHide, onCreate}) {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    }

    const handleCRChipChange = (chips) => {
        setFormData({
            ...formData,
            creditTransTypes: chips
        })
    }

    const handleDRChipChange = (chips) => {
        setFormData({
            ...formData,
            debitTransTypes: chips
        })
    }

    const handleAddNew = () => {
        if(formData.reportName === ''){
            setFormData({
                ...formData,
                message: "Invalid report name, should not be empty"
            });
            return;
        } else if(formData.creditTransTypes.length === 0 &&
            formData.debitTransTypes.length === 0)
        {
            setFormData({
                ...formData,
                message: "Invalid transaction types, should not be empty in both credit/debit"
            });
            return;
        } else {
            setFormData({
                ...formData,
                isLoading: true,
                message: ""
            });
        }
        ReportRequest.addNewReport(formData.reportName, 
        formData.creditTransTypes.map(e=>e.typeId+"").toString(),
        formData.debitTransTypes.map(e=>e.typeId+"").toString())
        .then( () => {
            if (typeof onCreate === 'function') {
                onCreate();
            }
            setFormData({
                ...formData,
                isLoading: true,
            });
            onHide();
        })
        .catch( err => {
            console.log(err);
            setFormData({
                ...formData,
                message: err.response.data,
                isLoading: false,
            })
        });
    }

    const handleOnShow = () => {
        setFormData({
          ...initialState
        })
    }

    return (
    <ModalContainer title="Add New Report" show={show}
        onHide={onHide} onShow={handleOnShow} size='lg'
        footer={
            <Button variant="danger" block onClick={handleAddNew}>
            {
                formData.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : 'Create'
            }
            </Button>
        }>
        <Form>
            <Row>
                <Col xs={3}>Name</Col>
                <Col>
                    <Form.Control name="reportName" type="input" onChange={handleChange}
                        value={formData.reportName}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>Credit Transaction Types</Col>
                <Col>
                    <TransactionTypesChips value={formData.creditTransTypes}
                            onChange={handleCRChipChange} name="creditTransTypes"
                            onFilter={e => e.typeCRDR==='Credit'}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>Debit Transaction Types</Col>
                <Col>
                    <TransactionTypesChips value={formData.debitTransTypes}
                            onChange={handleDRChipChange} name="debitTransTypes"
                            onFilter={e => e.typeCRDR==='Debit'}/>
                </Col>
            </Row>  
            <Row>
                <Col>
                    <Form.Text className='text-danger'>{formData.message}</Form.Text>
                </Col>
            </Row> 
        </Form>
    </ModalContainer>
    );
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(AddNewReportModal);