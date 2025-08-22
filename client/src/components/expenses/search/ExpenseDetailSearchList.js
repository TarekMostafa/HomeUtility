import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import TableLimiterDropDown from '../../common/TableLimiterDropDown';
import ExpenseTypesDropDown from '../expensetypes/ExpenseTypesDropDown';
import YesNoDropDown from '../../common/YesNoDropDown';
import ExpenseDetailTable from '../ExpenseDetailTable';
import LabelDropDown from '../../common/LabelDropDown';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';

import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';
import ExpenseTypeRequest from '../../../axios/ExpenseTypeRequest';

const initialState = {
    limit: 10,
    description: '',
    includeDescription: true,
    expDateFrom: '',
    expDateTo: '',
    expTypes: '',
    adjusment: '',
    labelNumber: '',
    labelValue: '',
    expCurrency: '',
}

function ExpenseDetailSearchList(props) {

    const [formData, setFormData] = useState(initialState);
    const [expensesDetails, setExpensesDetails] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [appearMoreButton, setAppearMoreButton] = useState(true);

    const loadExpenseTypes = () => 
        ExpenseTypeRequest.getExpenseTypes()
        .then(expTypes => setExpenseTypes(expTypes));

    const loadExpensesDetails = (append) => 
        ExpenseDetailRequest.getExpensesDetails(
            formData.limit,
            append?expensesDetails.length:0,
            formData.description,
            formData.includeDescription,
            formData.expDateFrom,
            formData.expDateTo,
            formData.adjusment,
            formData.expTypes,
            (formData.labelNumber==="1"?formData.labelValue:null),
            (formData.labelNumber==="2"?formData.labelValue:null),
            (formData.labelNumber==="3"?formData.labelValue:null),
            (formData.labelNumber==="4"?formData.labelValue:null),
            (formData.labelNumber==="5"?formData.labelValue:null),
            formData.expCurrency,
        )
        .then(expsDetails => {
            setExpensesDetails(
                append? [...expensesDetails, ...expsDetails] : expsDetails
            );
            setAppearMoreButton((expsDetails.length >= formData.limit));
        });

    useEffect(()=>{
        loadExpenseTypes();
        loadExpensesDetails();
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
          })
    }

    const handleListClick = () => {
        loadExpensesDetails(false);
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleMoreClick = () => {
        loadExpensesDetails(true);
    }

    const handleExpDateFromChange = (jsDate, date) => {
        setFormData({
            ...formData,
            expDateFrom: date
        });
    }
    
    const handleExpDateToChange = (jsDate, date) => {
        setFormData({
            ...formData,
            expDateTo: date
        });
    }

    //const handleExpTypes = (key, value) => {
    //    let _expTypes = formData.expTypes;
    //    if(_expTypes.some(exp=>exp.key === key)) {
    //        _expTypes = _expTypes.filter(exp=>exp.key!==key);
    //    } else {
    //        _expTypes = [..._expTypes, {key, value}];
    //    }
    //    setFormData({
    //        ...formData,
    //        expTypes: _expTypes
    //    })
    //  }

    return (
        <React.Fragment>
            <FormContainer title="Expenses Details Search">
                <Form>
                    <Row>
                    <Col xs={6}>
                    <Form.Control as="select" size="sm" name="expTypes" onChange={handleChange}
                        value={formData.expTypes}>
                        <option value=''>Expense Type</option>
                        <ExpenseTypesDropDown expenseTypes={expenseTypes}/>
                        </Form.Control>
                    </Col>
                    <Col>
                        <DatePickerInput value={formData.expDateFrom}
                        onChange={handleExpDateFromChange} readOnly 
                        placeholder="Expense Date From" small/>
                    </Col>
                    <Col>
                        <DatePickerInput value={formData.expDateTo}
                        onChange={handleExpDateToChange} readOnly 
                        placeholder="Expense Date To" small/>
                    </Col>
                    </Row>
                    <br />
                    <Row>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Checkbox name="includeDescription"
                                checked={formData.includeDescription} onChange={handleChange}/>
                            </InputGroup.Prepend>
                            <Form.Control type="input" placeholder="description" size="sm" name="description"
                                onChange={handleChange} value={formData.description}/>
                        </InputGroup>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <Form.Control as="select" size="sm" name="labelNumber" onChange={handleChange}
                                value={formData.labelNumber}>
                                <option key=' ' value=' '>Labels</option>
                                <LabelDropDown />
                            </Form.Control>
                            <Form.Control type="input" placeholder="Transaction Label" size="sm" name="labelValue"
                                onChange={handleChange} value={formData.labelValue}/>
                        </InputGroup>
                    </Col>
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" name="expCurrency" onChange={handleChange}
                            value={formData.expCurrency}>
                            <option value=''>Currency</option>
                            <CurrenciesDropDown />
                        </Form.Control>        
                    </Col>
                    <Col xs={1}>
                        <Form.Control as="select" size="sm" name="adjusment" onChange={handleChange}
                            value={formData.adjusment}>
                            <option value=''>Adjusment</option>
                            <YesNoDropDown yesText="Yes - Adjusment" noText="No - Adjusment"/>
                        </Form.Control>
                    </Col> 
                    <Col xs={1}>
                        <Form.Control as="select" size="sm" name="limit" onChange={handleChange}
                            value={formData.limit}>
                            <TableLimiterDropDown />
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
                <ExpenseDetailTable expenseDetails={expensesDetails} readOnly/>
                <Button variant="primary" size="sm" block onClick={handleMoreClick}
                    hidden={!appearMoreButton}>
                    more...</Button>
            </FormContainer>
        </React.Fragment>
    )
}

export default ExpenseDetailSearchList;