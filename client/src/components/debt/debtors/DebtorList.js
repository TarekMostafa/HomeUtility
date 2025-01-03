import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {useHistory} from 'react-router';
// import { connect } from 'react-redux';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../../wealth/accounts/AccountStatusesDropDown';
import DebtorTable from './DebtorTable';
import DebtorAddModal from './DebtorAddModal';
import DebtorEditModal from './DebtorEditModal';
import DebtorDeleteModal from './DebtorDeleteModal';
import DebtorViewModal from './DebtorViewModal';
import DebtorAddExemptionModal from './DebtorAddExemptionModal';
import DebtorTotalBalance from './DebtorTotalBalance';

import DebtorRequest from '../../../axios/DebtorRequest';

const initialState = {
    debtorCurrency: "",
    debtorStatus: "ACTIVE"
}

function DebtorList(props) {
    const [formData, setFormData] = useState(initialState);
    const [debtors, setDebtors] = useState([]);
    const [formattedTotal, setFormattedTotal] = useState('0');
    const [baseCurrency, setBaseCurrency] = useState('');
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});
    const [modalView, setModalView] = useState({show: false, id: 0});
    const [modalExemptionView, setModalExemptionView] = useState({show: false, id: 0});
    const history = useHistory();

    const loadDebtors = () => 
        DebtorRequest.getDebtors(formData.debtorCurrency, formData.debtorStatus)
        .then(response => {
            setDebtors(response.debtors);
            setFormattedTotal(response.totalDebtorBalanceFormatted);
            setBaseCurrency(response.baseCurrency)
        });

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

    const handleAddExemption = (id) => {
        setModalExemptionView({show: true, id});
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
                {
                    // props.appSettings && props.appSettings.baseCurrency &&
                    // props.appSettings.currency &&
                    <DebtorTotalBalance debtors={debtors}
                        // baseCurrency={props.appSettings.baseCurrency}
                        // decimalPlace={props.appSettings.currency.currencyDecimalPlace}
                        baseCurrency={baseCurrency}
                        formattedTotal={formattedTotal}
                    />
                }
                <DebtorTable debtors={debtors} 
                onEditDebtor={handleEditDebtor}
                onDeleteDebtor={handleDeleteDebtor}
                onViewDebtor={handleViewDebtor}
                onAddExemption={handleAddExemption}
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
            <DebtorAddExemptionModal
                debtorId={modalExemptionView.id}
                show={modalExemptionView.show}
                onHide={()=>setModalExemptionView({show: false, id: 0})}
                onExempt={()=>loadDebtors()}
            />
        </React.Fragment>
    );
}

// const mapStateToProps = (state) => {
// 	return {
//     appSettings: state.lookups.appSettings,
// 	}
// }

//export default connect(mapStateToProps)(DebtorList);
export default DebtorList;