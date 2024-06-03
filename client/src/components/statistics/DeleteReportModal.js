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

function DeleteReportModal ({reportId, transactionTypes, show, onHide, onDelete}) {
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

    const handleDelete = () => {
        setFormData({
            ...formData,
            isLoading: true,
            message: ""
        });
        ReportRequest.deleteReport(reportId)
        .then( () => {
            if (typeof onDelete=== 'function') {
                onDelete();
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
    <ModalContainer title="Delete Report" show={show}
        onHide={onHide} onShow={handleOnShow} size='lg'
        footer={
            <Button variant="danger" block onClick={handleDelete}>
            {
                formData.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : 'Delete'
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
                    <Form.Control name="reportName" type="input" readOnly
                        value={formData.reportName}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>Credit Transaction Types</Col>
                <Col>
                    <TransactionTypesChips value={formData.creditTransTypes}
                            readOnly name="creditTransTypes"
                            onFilter={e => e.typeCRDR==='Credit'}/>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>Debit Transaction Types</Col>
                <Col>
                    <TransactionTypesChips value={formData.debitTransTypes}
                            readOnly name="debitTransTypes"
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

export default connect(mapStateToProps)(DeleteReportModal);