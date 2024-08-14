import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import '../../../App.css';
import amountFormatter from '../../../utilities/amountFormatter';

function FXTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Date From</th>
          <th>Amount From</th>
          <th>Currency From</th>
          <th>Amount To</th>
          <th>Currency To</th>
          <th>Rate</th>
          <th>Account From</th>
          <th>Account To</th>
          <th>Date To</th>
          <th>Id</th>
        </tr>
      </thead>
      <tbody>
        {
          props.fxTransactions && props.fxTransactions.map( (transaction, index) => {
          return (
            <tr key={transaction.fxId}>
              <td>{index+1}</td>
              <td>{moment(transaction.fxPostingDateFrom).format('DD/MM/YYYY')}</td>
              <td className="text-right">
                {amountFormatter(transaction.fxAmountFrom, transaction.fxCurrencyFromDecimalPlace)}
              </td>
              <td>{transaction.fxCurrencyFrom}</td>
              <td className="text-right">
                {amountFormatter(transaction.fxAmountTo, transaction.fxCurrencyToDecimalPlace)}
              </td>
              <td>{transaction.fxCurrencyTo}</td>
              <td>{transaction.fxRate}</td>
              <td>{transaction.accountFrom}</td>
              <td>{transaction.accountTo}</td>
              <td>{moment(transaction.fxPostingDateTo).format('DD/MM/YYYY')}</td>
              <td>{transaction.fxId}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default FXTransactionTable;
