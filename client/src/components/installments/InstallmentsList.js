import React, {useState, useEffect} from 'react';
import { Button, Form, Row, Col} from 'react-bootstrap';

import FormContainer from '../common/FormContainer';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import InstallmentTable from './InstallmentsTable';
import InstallmentAddModal from './InstallmentAddModal';
import InstallmentEditModal from './InstallmentEditModal';
import InstallmentViewModal from './InstallmentViewModal';
import InstallmentDeleteModal from './InstallmentDeleteModal';
import InstallmentRequest from '../../axios/InstallmentRequest';

const initialState = {
  instCurrency: '',
}

function InstallmentsList(props) {
    
    const [formData, setFormData] = useState(initialState);
    const [installments, setInstallments] = useState([]);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalView, setModalView] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});

    const loadInstallments = () => InstallmentRequest.getInstallments(formData.instCurrency)
        .then(insts => setInstallments(insts));
    
    useEffect(()=>{
        loadInstallments();
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
        })
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleListClick = () => {
        loadInstallments();
    }

    return (
        <React.Fragment>
            <FormContainer title="Installments" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
                    Create New Installment</Button>
            }>
                <Form>
                    <Row>
                        <Col xs={3}>
                            <Form.Control as="select" size="sm" name="instCurrency" onChange={handleChange}
                                value={formData.instCurrency}>
                                <option value=''>Currencies</option>
                                <CurrenciesDropDown />
                            </Form.Control>
                        </Col>
                        <Col xs={1}>
                            <Button variant="primary" size="sm" block onClick={handleListClick}>
                                List</Button>
                        </Col>
                        <Col xs={1}>
                            <Button variant="secondary" size="sm" block onClick={handleResetClick}>
                                Reset</Button>
                        </Col>
                    </Row>
                </Form>
            </FormContainer>
            <FormContainer>
                <InstallmentTable installments={installments}
                onInstallmentEdit={(id)=>setModalEdit({show: true, id})}
                onInstallmentView={(id)=>setModalView({show: true, id})}
                onInstallmentDelete={(id)=>setModalDelete({show: true, id})}
                onInstallmentDetails={(id)=>props.history.push('installmentDetails', {instId: id})}/>
            </FormContainer>
            <InstallmentAddModal 
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadInstallments()}
            />
            <InstallmentEditModal 
                instId={modalEdit.id}
                show={modalEdit.show} 
                onHide={()=>setModalEdit(false)}
                onSave={()=>loadInstallments()}
            />
            <InstallmentViewModal 
                instId={modalView.id}
                show={modalView.show} 
                onHide={()=>setModalView(false)}
            />
            <InstallmentDeleteModal 
                instId={modalDelete.id}
                show={modalDelete.show} 
                onHide={()=>setModalDelete(false)}
                onDelete={()=>loadInstallments()}
            />
        </React.Fragment>
    );
}

export default InstallmentsList;