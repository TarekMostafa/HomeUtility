import React from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import '../../../App.css';

function LabelTransactionTable (props) {

    const headers = props.headers;
    const rows = props.rows;

    return (
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                <th>#</th>
                <th>Date Range</th>
                {
                    headers && headers.map( (header, index) => {
                        return (
                            <th key={index+1}>{header}</th>
                        )
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    rows && rows.map( (row, index) => {
                        const dateFrom = props.rowsData[index][0];
                        const dateTo = props.rowsData[index][1];
                        return (
                            <tr key={index+1}>
                                <td>{index+1}</td>
                                <td>
                                    <Row>
                                        <Col>{moment(dateFrom).format('DD/MM/YYYY')}</Col>
                                    </Row>
                                    <Row>
                                        <Col>{moment(dateTo).format('DD/MM/YYYY')}</Col>
                                    </Row>
                                </td>
                                <td>{row[0]}</td>
                                {
                                    row.filter((_, index) => index > 0)
                                    .map( (data, index) => {
                                        return (
                                            <td key={index+1}>
                                                <Button variant="link" 
                                                onClick={() => props.onDetailsClick(
                                                    props.label, headers[index+1], props.currency, 
                                                    dateFrom, 
                                                    dateTo,
                                                    data
                                                )}>
                                                    {data}
                                                </Button>
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default LabelTransactionTable;