import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';

function WealthAccountTable (props) {
  return (
    <Table hover size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Account Number</th>
          <th>Currency</th>
          <th>Start Balance</th>
          <th>Current Balance</th>
          <th>Equivalent Balance</th>
          <th>Status</th>
          <th>Balance Last Update</th>
        </tr>
      </thead>
      <tbody>
        {props.accounts && props.accounts.map( (account, index) => {
          return (
            <tr key={account.accountId} className={account.accountStatus==="CLOSED"?"table-danger":""}>
              <td>{index+1}</td>
              <td>{account.bank.bankName}</td>
              <td>{account.accountNumber}</td>
              <td>{account.acccountCurrency}</td>
              <td>{new Intl.NumberFormat().format(account.accountStartBalance)}</td>
              <td>{new Intl.NumberFormat().format(account.accountCurrentBalance)}</td>
              <td>{new Intl.NumberFormat().format(account.accountCurrentBalance)}</td>
              <td>{account.accountStatus}</td>
              <td>{moment(account.accountLastBalanceUpdate).format('DD/MM/YYYY HH:mm:ss')}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthAccountTable;
