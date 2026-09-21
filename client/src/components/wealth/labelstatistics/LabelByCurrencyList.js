import React, {useState} from 'react';
import { Form, Row, Col, SplitButton, 
    Dropdown, Spinner, Card, Container, CardColumns,
    Table, Badge, Button } from 'react-bootstrap';

import moment from 'moment';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import LabelDropDown from '../../common/LabelDropDown';

import LabelRequest from '../../../axios/LabelRequest';
import LabelLinkDetails from './LabelLinkDetails';
import TransactionRequest from '../../../axios/TransactionRequest';
import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';

const initialState = {
    label: '',
    currency: '',
    message: '',
    isLoading: false,
}

function LabelByCurrencyList () {

    const [labelData, setLabelData] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [modalLabelDetailShow, setModalLabelDetailShow] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [transactionsData, setTransactionsData] = useState({});
    const [modalLabelDetailExpenseShow, setModalLabelDetailExpenseShow] = useState(false);
    const [expDetails, setExpDetails] = useState([]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleList = (isGenerate) => {
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
        } else {
            setFormData({
                ...formData,
                message: '',
                isLoading: true,
            });
        }
        //Get Label Data
        LabelRequest.getLabels(formData.label, formData.currency, (isGenerate?true:null))
        .then( (result) => {
            setLabelData(result);
            setFormData({
                ...formData,
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

    const renderButtonTitle = (buttonText) => {
        return (
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : buttonText
        )
    }

    const handleLabelClick = (labelNumber, labelValue, labelCurrency, total) => {
        TransactionRequest.getTransactions(999, 0, [], [], null, 
            null, null, null, null, [labelCurrency], 'POST', null, 
            (labelNumber===1?labelValue:null), 
            (labelNumber===2?labelValue:null), 
            (labelNumber===3?labelValue:null), 
            (labelNumber===4?labelValue:null), 
            (labelNumber===5?labelValue:null) 
        ).then( transactions => {
            setTransactions(transactions);
            setTransactionsData({
                labelName: labelValue,
                currency: labelCurrency,
                total
            })
            setModalLabelDetailShow(true);
        });

        ExpenseDetailRequest.getExpensesDetails(
            999, 0, null, null, null, null, null, null,
            (labelNumber===1?labelValue:null),
            (labelNumber===2?labelValue:null),
            (labelNumber===3?labelValue:null),
            (labelNumber===4?labelValue:null),
            (labelNumber===5?labelValue:null),
            labelCurrency,
        ).then(expsDetails => {
            setExpDetails(expsDetails);
            setModalLabelDetailExpenseShow(true);
        });
    }

    return (
        <React.Fragment>
            <FormContainer>
                <Form>
                    <Row>
                        <Col>
                            <Form.Control as="select" size="sm" name="label" 
                                onChange={handleChange}
                                value={formData.label}>
                                <option value=''>Label</option>
                                <LabelDropDown />
                            </Form.Control> 
                        </Col>
                        <Col>
                            <Form.Control as="select" size="sm" name="currency" 
                                onChange={handleChange}
                                value={formData.currency}>
                                <option value=''>Currency</option>
                                <CurrenciesDropDown />
                            </Form.Control>                           
                        </Col>
                        <Col xs={1}>
                            <SplitButton id="dropdown-split-variants-primary" size="sm"
                            variant="primary" disabled={formData.isLoading} title={renderButtonTitle("List")} onClick={() => handleList(false)}>
                                <Dropdown.Item onClick={() => handleList(true)}>
                                    {renderButtonTitle("Generate and List")}
                                </Dropdown.Item>
                            </SplitButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Text className='text-danger'>{formData.message}</Form.Text>
                        </Col>
                    </Row> 
                </Form>
            </FormContainer>
            <hr />
            <Container fluid>
                <CardColumns>
                {
                    labelData && labelData.map( l => {
                        return (
                            <Card key={l.labelId} text='dark' className="mb-2" border="secondary">
                                <Card.Body>
                                     <Card.Title>
                                        <Row>
                                            <Col xs={7}>
                                                <Button variant="link" 
                                                onClick={() => handleLabelClick(
                                                    l.labelNumber, l.labelText, l.labelCurrency,
                                                    l.labelSumTotalFormatted
                                                )}>
                                                    <h4>{l.labelText}</h4>
                                                </Button>
                                            </Col>
                                            <Col xs={5} className="d-flex justify-content-end">
                                                <h6><Badge variant="light">
                                                    {l.labelSumTotalFormatted}
                                                </Badge>
                                                /
                                                <Badge variant="light" >
                                                    {l.labelCRCount + l.labelDRCount}
                                                </Badge></h6>
                                            </Col>
                                        </Row>
                                    </Card.Title>
                                     <Table size="sm" responsive="sm">
                                        <tbody>
                                            <tr>
                                                <td>CR Total</td>
                                                <td>{l.labelCRSumFormatted}</td>
                                                <td>DR Total</td>
                                                <td>{l.labelDRSumFormatted}</td>
                                            </tr>
                                            <tr>
                                                <td>CR Count</td>
                                                <td>{l.labelCRCount}</td>
                                                <td>DR Count</td>
                                                <td>{l.labelDRCount}</td>
                                            </tr>
                                        </tbody>
                                     </Table>
                                </Card.Body>
                                <Card.Footer>
                                    <h6>{moment(l.labelLastUpdate).format('DD/MMM/YYYY HH:mm:ss')}</h6>
                                </Card.Footer>
                            </Card>
                        )
                    })  
                }
                </CardColumns>
            </Container>
            {
                (modalLabelDetailShow && modalLabelDetailExpenseShow) && 
                <LabelLinkDetails transactions={transactions}
                data={transactionsData} expenseDetails={expDetails}
                show={modalLabelDetailShow} onHide={() => { setModalLabelDetailShow(false); setModalLabelDetailExpenseShow(false); }}/>
            }
        </React.Fragment>
    );
}

export default LabelByCurrencyList;