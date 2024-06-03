import React, {useState, useEffect}  from 'react';
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

function EditReportModal ({reportId, transactionTypes, show, onHide, onSave}) {
    const [formData, setFormData] = useState(initialState);

    useEffect(()=>{
        //load report data
        ReportRequest.getReportDetails(reportId)
        .then( report => {
            setFormData({
                reportName: report.reportName,
                creditTransTypes: report.transTypesCR? 
                    transactionTypes.filter(e => report.transTypesCR.split(',').includes(e.typeId+'')) : [],
                debitTransTypes: report.transTypesDR? 
                    transactionTypes.filter(e => report.transTypesDR.split(',').includes(e.typeId+'')): []
            })
        });
    }, [reportId]);

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

    const handleSave = () => {
        setFormData({
            ...formData,
            isLoading: true,
            message: ""
        });
        ReportRequest.editReport(reportId, formData.reportName, 
        formData.creditTransTypes.map(e=>e.typeId+"").toString(),
        formData.debitTransTypes.map(e=>e.typeId+"").toString())
        .then( () => {
            if (typeof onSave=== 'function') {
                onSave();
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
    <ModalContainer title="Edit Report" show={show}
        onHide={onHide} onShow={handleOnShow} size='lg'
        footer={
            <Button variant="danger" block onClick={handleSave}>
            {
                formData.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : 'Save'
            }
            </Button>
        }>
        <Form>
            <Row>
                <Col xs={3}>Id</Col>
                <Col>
                    <Form.Control name="reportId" type="input" readOnly
                        value={reportId}/>
                </Col>
            </Row>
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

export default connect(mapStateToProps)(EditReportModal);