import React, {useState} from 'react';
import { Form, Row, Col, SplitButton, 
    Dropdown, Spinner, Card, Container, CardColumns,
    Table, Badge } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import CurrenciesDropDown from '../../currencies/CurrenciesDropDown';
import LabelDropDown from '../../common/LabelDropDown';

import LabelRequest from '../../../axios/LabelRequest';

const initialState = {
    label: '',
    currency: '',
    message: '',
    isLoading: false,
}

function LabelByCurrencyList () {
    const [labelData, setLabelData] = useState([]);
    const [formData, setFormData] = useState(initialState);

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
                                            <Col xs={8}>
                                                <h4>{l.labelText}</h4>
                                            </Col>
                                            <Col xs={4}>
                                                <h4><Badge variant="primary" className="fs-4">
                                                    {l.labelSumTotalFormatted}
                                                </Badge></h4>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{ span: 4, offset: 8 }}>
                                                <h4><Badge variant="info" >
                                                    {l.labelCRCount + l.labelDRCount}
                                                </Badge></h4>
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
                            </Card>
                        )
                    })  
                }
                </CardColumns>
            </Container>
        </React.Fragment>
    );
}

export default LabelByCurrencyList;