import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function DebtorTable(props) {
    return (
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Debtor Name</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Balance</th>
                    <th>Balance Last Update</th>
                    <th>Id</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.debtors && props.debtors.map( (debtor, index) => {
                        return (
                            <tr key={debtor.Id} className={debtor.Status==="CLOSED"?"table-danger":""}>
                                <td>{index+1}</td>
                                <td>{debtor.Name}</td>
                                <td>{debtor.Currency}</td>
                                <td>{debtor.Status}</td>
                                <td className="text-right">
                                    {amountFormatter(debtor.Balance, debtor.CurrencyDecimalPlace)}
                                </td>
                                <td>
                                    {
                                    debtor.LastBalanceUpdate ? 
                                    moment(debtor.LastBalanceUpdate).format('DD/MM/YYYY HH:mm:ss') : ''
                                    }
                                </td>
                                <td>{debtor.Id}</td>
                                <td>
                                    <DropdownButton id="dropdown-basic-button" title="Actions"
                                        size="sm" variant="primary">
                                        <Dropdown.Item onClick={() => props.onDebtRelTransactions(debtor)}>
                                            Transactions
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => props.onEditDebtor(debtor.Id)}>
                                            Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => props.onViewDebtor(debtor.Id)}>
                                            View
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => props.onDeleteDebtor(debtor.Id)}>
                                            Delete
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default DebtorTable;