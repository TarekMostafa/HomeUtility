import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {useHistory} from 'react-router';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../../wealth/accounts/AccountStatusesDropDown';
import DebtorTable from './DebtorTable';
import DebtorAddModal from './DebtorAddModal';
import DebtorEditModal from './DebtorEditModal';
import DebtorDeleteModal from './DebtorDeleteModal';
import DebtorViewModal from './DebtorViewModal';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    debtorCurrency: "",
    debtorStatus: "ACTIVE"
}

function DebtorList() {
    const [formData, setFormData] = useState(initialState);
    const [debtors, setDebtors] = useState([]);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});
    const [modalView, setModalView] = useState({show: false, id: 0});
    const history = useHistory();

    const loadDebtors = () => 
        DebtorRequest.getDebtors(formData.debtorCurrency, formData.debtorStatus)
        .then(debtors => setDebtors(debtors));

    useEffect(()=>{
        loadDebtors();
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleListClick = () => {
        loadDebtors();
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleEditDebtor = (id) => {
        setModalEdit({show: true, id});
    }

    const handleDeleteDebtor = (id) => {
        setModalDelete({show: true, id});
    }

    const handleViewDebtor = (id) => {
        setModalView({show: true, id});
    }

    const handleDebtRelTransactions = (debtor) => {
        history.push({
            pathname:  '/relatedtransactiondetails/'+debtor.RelId
        });
    }

    return (
        <React.Fragment>
            <FormContainer title="Debtors Summary" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
                    Add New Debtor</Button>
                }>
                <Form>
                    <Row>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="debtorCurrency" onChange={handleChange}
                        value={formData.debtorCurrency}>
                        <option value=''>Currencies</option>
                        <CurrenciesDropDown />
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="debtorStatus" onChange={handleChange}
                        value={formData.debtorStatus}>
                        <option value=''>Debtor Statuses</option>
                        <AccountStatusesDropDown />
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
                <DebtorTable debtors={debtors} 
                onEditDebtor={handleEditDebtor}
                onDeleteDebtor={handleDeleteDebtor}
                onViewDebtor={handleViewDebtor}
                onDebtRelTransactions={handleDebtRelTransactions}/>
            </FormContainer>
            <DebtorAddModal 
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadDebtors()}
            />
            <DebtorEditModal
                debtorId={modalEdit.id}
                show={modalEdit.show}
                onHide={()=>setModalEdit({show: false, id: 0})}
                onSave={()=>loadDebtors()}
            />
            <DebtorDeleteModal
                debtorId={modalDelete.id}
                show={modalDelete.show}
                onHide={()=>setModalDelete({show: false, id: 0})}
                onDelete={()=>loadDebtors()}
            />
            <DebtorViewModal
                debtorId={modalView.id}
                show={modalView.show}
                onHide={()=>setModalView({show: false, id: 0})}
            />
        </React.Fragment>
    );
}

export default DebtorList;