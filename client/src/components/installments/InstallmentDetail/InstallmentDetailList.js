import React, {useState, useEffect} from 'react';
import { Button, Form, Row, Col, InputGroup, Badge} from 'react-bootstrap';

import moment from 'moment';

import FormContainer from '../../common/FormContainer';
import InstallmentDetailTable from './InstallmentDetailTable';
import InstallmentDetailAddModal from './InstallmentDetailAddModal';
import InstallmentDetailEditModal from './InstallmentDetailEditModal';
import InstallmentDetailViewModal from './InstallmentDetailViewModal';
import InstallmentDetailDeleteModal from './InstallmentDetailDeleteModal';
import InstallmentDetailRequest from '../../../axios/InstallmentDetailRequest';
import InstallmentRequest from '../../../axios/InstallmentRequest';

const initialState = {
  instId: 0,
}

function InstallmentDetailList(props) {
    
    const [formData, setFormData] = useState(initialState);
    const [installment, setInstallment] = useState([]);
    const [installmentDetails, setInstallmentDetails] = useState([]);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalView, setModalView] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});

    const loadInstallment = (instId) => InstallmentRequest.getInstallment(instId)
        .then(inst => setInstallment(inst));

    const loadInstallmentDetails = (instId) => InstallmentDetailRequest.getInstallmentDetails(instId)
        .then(instDets => setInstallmentDetails(instDets));

    const load = (instId) => {
        loadInstallment(instId);
        loadInstallmentDetails(instId);
    }
    
    useEffect(()=>{
        const {instId} =  props.location.state;
        setFormData({...formData, instId});
        load(instId);
    },[])

    const toolbar = () => {
        if (installment.instStatus === "CLOSED")
            return "";
        else {
            return ( 
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
                        Add Installment Detail</Button>
            );
        }
    }

    return (
        <React.Fragment>
            <FormContainer title="Installment Details" toolbar={toolbar()}>
                <Form>
                    <Row>
                        <Col xs={1}>
                            <Form.Label>Id</Form.Label>
                            <Form.Control type="input" size="sm" name="id"
                            readOnly value={installment.instId}/>
                        </Col>
                        <Col xs={4}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="input" size="sm" name="name"
                            readOnly value={installment.instName}/>
                        </Col>
                        <Col xs={2}>
                            <Form.Label>Total Amount</Form.Label>
                            <InputGroup size="sm">
                                <Form.Control type="input" name="totalAmount"
                                readOnly value={installment.instAmountFormatted}/>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">
                                        {installment.instCurrency}
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col xs={2}>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="input" size="sm"
                            name="startDate"
                            value={moment(installment.instStartDate).format('DD/MM/YYYY')} readOnly/>
                        </Col>
                        <Col xs={2}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="input" size="sm"
                            name="endDate" 
                            value={moment(installment.instEndDate).format('DD/MM/YYYY')} readOnly/>
                        </Col>
                        <Col xs={1}>
                            <Badge variant={installment.instStatus==="CLOSED"?"warning":"success"}>{installment.instStatus}</Badge>
                        </Col>
                    </Row>
                    <Row><hr /></Row>
                    <Row className="justify-content-md-center">
                        <Col xs={2}>
                            <Form.Label>Entered Amount</Form.Label>
                            <InputGroup     >
                                <Form.Control type="input" name="EnteredAmount"
                                readOnly value={installment.instEnteredAmount}/>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">
                                        {installment.instCurrency}
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col xs={2}>
                            <Form.Label>Paid Amount</Form.Label>
                            <InputGroup     >
                                <Form.Control type="input" name="paidAmount"
                                readOnly value={installment.instPaidAmount}/>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">
                                        {installment.instCurrency}
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>
            </FormContainer>
            <FormContainer>
                <InstallmentDetailTable installmentDetails={installmentDetails}
                installment={installment}
                onInstallmentDetailEdit={(id)=>setModalEdit({show: true, id})}
                onInstallmentDetailView={(id)=>setModalView({show: true, id})}
                onInstallmentDetailDelete={(id)=>setModalDelete({show: true, id})}/>
            </FormContainer>
            <InstallmentDetailAddModal 
                instId={installment.instId}
                currency={installment.instCurrency}
                decimalPlaces={installment.decimalPlaces}
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>load(formData.instId)}
            />
            <InstallmentDetailEditModal 
                instDetId={modalEdit.id}
                show={modalEdit.show} 
                onHide={()=>setModalEdit(false)}
                onSave={()=>load(formData.instId)}
            />
            <InstallmentDetailViewModal 
                instDetId={modalView.id}
                show={modalView.show} 
                onHide={()=>setModalView(false)}
            />
            <InstallmentDetailDeleteModal 
                instDetId={modalDelete.id}
                show={modalDelete.show} 
                onHide={()=>setModalDelete(false)}
                onDelete={()=>load(formData.instId)}
            />
        </React.Fragment>
    );
}

export default InstallmentDetailList;