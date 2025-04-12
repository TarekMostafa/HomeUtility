import React from 'react';
import { Table } from 'react-bootstrap';
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
                        return (
                            <tr key={index+1}>
                                <td>{index+1}</td>
                                <td>{moment(row[0]).format('DD/MM/YYYY')}</td>
                                <td>{moment(row[1]).format('DD/MM/YYYY')}</td>
                                {
                                    row.filter((_, index) => index > 1)
                                    .map( (data, index) => {
                                        return (
                                            <td key={index+1}>{data}</td>
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