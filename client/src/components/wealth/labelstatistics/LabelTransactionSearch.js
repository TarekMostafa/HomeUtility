import React, {useState} from 'react';
import { Form, Row, Col, Spinner, SplitButton, 
    Dropdown } from 'react-bootstrap';

import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import LabelDropDown from '../../common/LabelDropDown';

import LabelTransactionTable from './LabelTransactionTable';
import LabelLinkDetails from './LabelLinkDetails';
import LabelsChips from '../../statistics/LabelsChips';
import TransactionRequest from '../../../axios/TransactionRequest';
import LabelRequest from '../../../axios/LabelRequest';
import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';

const initialState = {
    label: '',
    labelValues: [],
    currency: '',
    mode: '',
    dateFrom: '',
    dateTo: '',
    message: '',
    headers: ['Total'],
    rows: [],
    rowsData: [],
    isLoading: false,
}

function LabelTransactionSearch () {
    const [formData, setFormData] = useState(initialState);
    const [modalLabelDetailShow, setModalLabelDetailShow] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [transactionsData, setTransactionsData] = useState({});
    const [modalLabelDetailExpenseShow, setModalLabelDetailExpenseShow] = useState(false);
    const [expDetails, setExpDetails] = useState([]);

    const handleChange = (event, allow) => {

        if(formData.rows.length > 0 && !allow) return;

        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    }

    const handleDateFromChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateFrom: date
        });
    }
    
    const handleDateToChange = (jsDate, date) => {
        setFormData({
            ...formData,
            dateTo: date
        });
    }

    const handleAddClick = () => {
        if(!formData.label) {
            setFormData({
                ...formData,
                message: 'Invalid label, should not be empty'
            });
            return;
        } else if(!formData.currency) {
            setFormData({
                ...formData,
                message: 'Invalid currency, should not be empty'
            });
            return;
        } else if(!formData.dateFrom) {
            setFormData({
                ...formData,
                message: 'Invalid posting date from, should not be empty'
            });
            return;
        } else if(!formData.dateTo) {
            setFormData({
                ...formData,
                message: 'Invalid posting date to, should not be empty'
            });
            return;
        } else if (formData.dateFrom > formData.dateTo) {
            setFormData({
                ...formData,
                message: 'Posting date from must be less than or equal to Posting date to'
            });
            return;
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }
        // Get Label Statistics
        LabelRequest.getLabelStatistics(formData.label, formData.labelValues,
            formData.currency, formData.dateFrom, formData.dateTo, 
            formData.mode)
        .then( (result) => {

            let rows = [...formData.rows];
            let rowsData = [...formData.rowsData];
            let headers = [...formData.headers];
            let highestRowIndex = 0;
            for(let i=0; i<result.detailsList.length; i++) {
                let row = [];
                row[0] = result.detailsList[i].labelTotalFormatted;
                for(const details of result.detailsList[i].details) {
                    if(!headers.includes(details.label)) headers.push(details.label);
                    const index = headers.indexOf(details.label);
                    row[index] = details.totalFormatted;
                }
                //fill gaps
                for(let counter =0; counter <headers.length; counter++){
                    if(!row[counter]) row[counter] = '';
                }
                rows = [...rows, row];
                rowsData = [...rowsData, [result.detailsList[i].dateFrom, result.detailsList[i].dateTo]];

                if(row.length>highestRowIndex) highestRowIndex=row.length;
            }

            //fill gaps
            for(let i=0; i<rows.length; i++) {
                let row = rows[i];
                for(let c=row.length; c<highestRowIndex; c++) {
                    row.push('');
                }
            }

            setFormData({
                ...formData,
                headers,
                rows,
                rowsData,
                message: '',
                isLoading: false
            });
        })
        .catch( err => {
            setFormData({
                ...formData,
                message: err.response.data,
                isLoading: false,
            })
        })
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleDetailsClick = (labelNum, labelValue, currency, dateFrom, dateTo, total) => {
        TransactionRequest.getTransactions(999, 0, [], [], dateFrom, 
            dateTo, null, null, null, [currency], 'POST', null, 
            (labelNum==="1"?labelValue:null), 
            (labelNum==="2"?labelValue:null), 
            (labelNum==="3"?labelValue:null), 
            (labelNum==="4"?labelValue:null), 
            (labelNum==="5"?labelValue:null) 
        ).then( response => {
            setTransactions(response.transactions);
            setTransactionsData({
                labelName: labelValue,
                currency,
                dateFrom,
                dateTo,
                total
            })
            setModalLabelDetailShow(true);
        })

        ExpenseDetailRequest.getExpensesDetails(999, 0, null, null, dateFrom, 
            dateTo, null, null,
            (labelNum==="1"?labelValue:null),
            (labelNum==="2"?labelValue:null),
            (labelNum==="3"?labelValue:null),
            (labelNum==="4"?labelValue:null),
            (labelNum==="5"?labelValue:null),
            currency,
        ).then(response => {
            setExpDetails(response.expensesDetails);
            setModalLabelDetailExpenseShow(true);
        });
    }

    const renderButtonTitle = (buttonText) => {
        return (
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : buttonText
        )
    }

    const handleLabelChipChange = (chips) => {
        if(formData.rows.length > 0) return;
        const uppercaseChips = chips.map(chip => chip.toUpperCase());

        setFormData({
            ...formData,
            labelValues: uppercaseChips
        })
    }

    return (
        <React.Fragment>
        <FormContainer>
            <Form>
                <Row>
                    <Col xs={4}>
                        <Form.Control as="select" size="sm" name="label" 
                            onChange={handleChange}
                            value={formData.label} readOnly={formData.rows.length > 0}>
                            <option value=''>Label</option>
                            <LabelDropDown />
                        </Form.Control> 
                    </Col>
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" name="currency" 
                            onChange={handleChange}
                            value={formData.currency} readOnly={formData.rows.length > 0}>
                            <option value=''>Currency</option>
                            <CurrenciesDropDown />
                        </Form.Control>                           
                    </Col>
                    <Col xs={2}>
                        <DatePickerInput value={formData.dateFrom}
                            onChange={handleDateFromChange} readOnly 
                            placeholder="Date From" small/>
                    </Col>
                    <Col xs={2}>
                        <DatePickerInput value={formData.dateTo}
                            onChange={handleDateToChange} readOnly 
                            placeholder="Date From" small/>
                    </Col>
                    <Col xs={2}>
                        <SplitButton id="dropdown-split-variants-primary" 
                        size="sm" variant="primary" 
                        disabled={formData.isLoading} 
                        title={renderButtonTitle("Run/Add")} 
                        onClick={handleAddClick}>
                            <Dropdown.Item onClick={handleResetClick}>
                                {renderButtonTitle("Reset")}
                            </Dropdown.Item>
                        </SplitButton>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <LabelsChips value={formData.labelValues} 
                        onChange={handleLabelChipChange} name="labelValues"
                        placeholder="label values"/>
                    </Col>
                    <Col xs={{ span: 2, offset: 4 }}>
                        <Form.Control as="select" size="sm" name="mode" 
                            onChange={e=>handleChange(e, true)}
                            value={formData.mode}>
                            <option key=' ' value=''>Date Mode (No Mode)</option>
                            <option key='M' value='M'>Monthly</option>
                            <option key='Y' value='Y'>Yearly</option>
                        </Form.Control> 
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Text className='text-danger'>{formData.message}</Form.Text>
                    </Col>
                </Row>  
            </Form>
        </FormContainer>
        <FormContainer hscroll="true">
            <LabelTransactionTable
                label={formData.label} currency={formData.currency} 
                headers={formData.headers} rows={formData.rows}
                rowsData={formData.rowsData}
                onDetailsClick={handleDetailsClick}/>
        </FormContainer>
        {
                (modalLabelDetailShow && modalLabelDetailExpenseShow) && 
                <LabelLinkDetails transactions={transactions}
                data={transactionsData} expenseDetails={expDetails}
                show={modalLabelDetailShow} onHide={() => {setModalLabelDetailShow(false); setModalLabelDetailExpenseShow(false);}}/>
        }
        </React.Fragment>
    );
}

export default LabelTransactionSearch;