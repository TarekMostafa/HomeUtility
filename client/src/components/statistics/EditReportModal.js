import React, {useState, useEffect}  from 'react';
import { Form, Row, Col, Button, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalContainer from '../common/ModalContainer';
import TransactionTypesChips from '../wealth/transactiontypes/TransactionTypesChips';
import LabelsChips from './LabelsChips';
import ReportRequest from '../../axios/ReportRequest';

const initialState = {
    reportName: "",
    creditTransTypes: [],
    debitTransTypes: [],
    label1List: [],
    label1Op: 'IN',
    label2List: [],
    label2Op: 'IN',
    label3List: [],
    label3Op: 'IN',
    label4List: [],
    label4Op: 'IN',
    label5List: [],
    label5Op: 'IN',
    isLoading: false,
    message: "",
    currentPageNumber: 1,
    lastPageNumber: 2,
}

function EditReportModal ({reportId, transactionTypes, show, onHide, onSave}) {
    const [formData, setFormData] = useState(initialState);

    useEffect(()=>{
        //load report data
        ReportRequest.getReportDetails(reportId)
        .then( report => {
            setFormData({
                ...formData,
                reportName: report.reportName,
                creditTransTypes: report.transTypesCR? 
                    transactionTypes.filter(e => report.transTypesCR.split(',').includes(e.typeId+'')) : [],
                debitTransTypes: report.transTypesDR? 
                    transactionTypes.filter(e => report.transTypesDR.split(',').includes(e.typeId+'')): [],
                label1List: report.detailLabel1?
                    report.detailLabel1.split(':')[1].split(',') : [],
                label1Op: report.detailLabel1?
                    report.detailLabel1.split(':')[0]: 'IN',
                label2List: report.detailLabel2?
                    report.detailLabel2.split(':')[1].split(',') : [],
                label2Op: report.detailLabel2?
                    report.detailLabel2.split(':')[0]: 'IN',
                label3List: report.detailLabel3?
                    report.detailLabel3.split(':')[1].split(',') : [],
                label3Op: report.detailLabel3?
                    report.detailLabel3.split(':')[0]: 'IN',
                label4List: report.detailLabel4?
                    report.detailLabel4.split(':')[1].split(',') : [],
                label4Op: report.detailLabel4?
                    report.detailLabel4.split(':')[0]: 'IN',
                label5List: report.detailLabel5?
                    report.detailLabel5.split(':')[1].split(',') : [],
                label5Op: report.detailLabel5?
                    report.detailLabel5.split(':')[0]: 'IN',
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

    const handleLabelChipChange = (chips, number) => {
        const uppercaseChips = chips.map(chip => chip.toUpperCase());
        if(number === 1) {
            setFormData({
                ...formData,
                label1List: uppercaseChips
            })
        }else if(number === 2){
            setFormData({
                ...formData,
                label2List: uppercaseChips
            })
        }else if(number === 3){
            setFormData({
                ...formData,
                label3List: uppercaseChips
            })
        }else if(number === 4){
            setFormData({
                ...formData,
                label4List: uppercaseChips
            })
        }else if(number === 5){
            setFormData({
                ...formData,
                label5List: uppercaseChips
            })
        } 
    }

    const handleSave = () => {
        switch(formData.currentPageNumber){
            case 1:
                if(!validatePage1()) return;
                break;
            case 2:
                break;
            default:
                return;        
        }

        if(formData.currentPageNumber !== formData.lastPageNumber) 
        {
            setFormData({
                ...formData,
                currentPageNumber: formData.currentPageNumber + 1,
            });
            return;
        }

        setFormData({
            ...formData,
            isLoading: true,
            message: ""
        });

        ReportRequest.editReport(reportId, formData.reportName, 
        formData.creditTransTypes.map(e=>e.typeId+"").toString(),
        formData.debitTransTypes.map(e=>e.typeId+"").toString(),
        (formData.label1List.length > 0?formData.label1Op + ':' + formData.label1List.join(","):""),
        (formData.label2List.length > 0?formData.label2Op + ':' + formData.label2List.join(","):""),
        (formData.label3List.length > 0?formData.label3Op + ':' + formData.label3List.join(","):""),
        (formData.label4List.length > 0?formData.label4Op + ':' + formData.label4List.join(","):""),
        (formData.label5List.length > 0?formData.label5Op + ':' + formData.label5List.join(","):"")
        )
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

    const validatePage1 = () => {
        if(formData.reportName === ''){
            setFormData({
                ...formData,
                message: "Invalid report name, should not be empty"
            });
            return false;
        } else if(formData.creditTransTypes.length === 0 &&
            formData.debitTransTypes.length === 0)
        {
            setFormData({
                ...formData,
                message: "Invalid transaction types, should not be empty in both credit/debit"
            });
            return false;
        }

        return true;
    }

    const handleOnShow = () => {
        setFormData({
          ...initialState
        })
    }

    const getPage1View = () => {
        return (
            <React.Fragment>
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
            </React.Fragment>
        )
    }

    const getOperatorDropDown = (labelNumber) => {
        return (
            <Form.Control as="select" size="sm" name={`label${labelNumber.trim()}Op`} onChange={handleChange}
                value={formData[`label${labelNumber.trim()}Op`]}>
                <option value='IN'>In</option>
                <option value='NIN'>Not In</option>
            </Form.Control>
        )
    }

    const getPage2View = () => {
        return (
            <React.Fragment>
                <Row>
                    <Col xs={3}>Label 1</Col>
                    <Col xs={2}>{getOperatorDropDown("1")}</Col>
                    <Col><LabelsChips value={formData.label1List} 
                        onChange={(chips) => handleLabelChipChange(chips, 1)} name="label1List"/></Col>
                </Row>
                <Row>
                    <Col xs={3}>Label 2</Col>
                    <Col xs={2}>{getOperatorDropDown("2")}</Col>
                    <Col><LabelsChips value={formData.label2List} 
                        onChange={(chips) => handleLabelChipChange(chips, 2)} name="label2List"/></Col>
                </Row>
                <Row>
                    <Col xs={3}>Label 3</Col>
                    <Col xs={2}>{getOperatorDropDown("3")}</Col>
                    <Col><LabelsChips value={formData.label3List} 
                        onChange={(chips) => handleLabelChipChange(chips, 3)} name="label3List"/></Col>
                </Row>
                <Row>
                    <Col xs={3}>Label 4</Col>
                    <Col xs={2}>{getOperatorDropDown("4")}</Col>
                    <Col><LabelsChips value={formData.label4List} 
                        onChange={(chips) => handleLabelChipChange(chips, 4)} name="label4List"/></Col>
                </Row>
                <Row>
                    <Col xs={3}>Label 5</Col>
                    <Col xs={2}>{getOperatorDropDown("5")}</Col>
                    <Col><LabelsChips value={formData.label5List} 
                        onChange={(chips) => handleLabelChipChange(chips, 5)} name="label5List"/></Col>
                </Row>
            </React.Fragment>
        )
    }

    return (
    <ModalContainer title="Edit Report" show={show}
        onHide={onHide} onShow={handleOnShow} size='lg'
        footer={
            <Button variant={formData.currentPageNumber === formData.lastPageNumber ? "danger" : "info"} 
                block onClick={handleSave}>
            {
                formData.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : formData.currentPageNumber === formData.lastPageNumber ? "Save" : "Next"
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
            <hr />
            {
                formData.currentPageNumber === 1 && getPage1View()
            }
            {
                formData.currentPageNumber === 2 && getPage2View()
            }
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