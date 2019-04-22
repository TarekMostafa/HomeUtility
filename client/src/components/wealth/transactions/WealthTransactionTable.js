import React from 'react';
import { Table, OverlayTrigger, Tooltip, ButtonGroup, Button, Badge } from 'react-bootstrap';
import moment from 'moment';
import '../../../App.css';
import _ from 'lodash';
import amountFormatter from '../../../utilities/amountFormatter';

function WealthTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Account Number</th>
          <th>Posting Date</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Credit/Debit</th>
          <th>Type Name</th>
          <th>Narrative</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          props.transactions && props.transactions.map( (transaction, index) => {
          return (
            <tr key={transaction.transactionId}>
              <td>{index+1}</td>
              <td>{transaction.account.accountNumber}</td>
              <td>{moment(transaction.transactionPostingDate).format('DD/MM/YYYY')}</td>
              <td className="text-right">
                {amountFormatter(transaction.transactionAmount, transaction.account.currency.currencyDecimalPlace)}
              </td>
              <td>{transaction.account.acccountCurrency}</td>
              <td>{transaction.transactionCRDR}</td>
              <td>{_.isNil(transaction.transactionType) ? '' : transaction.transactionType.typeName}</td>
              <td>
                <OverlayTrigger placement="right"
                  delay={{ show: 250, hide: 400 }} overlay={(
                    <Tooltip>{transaction.transactionNarrative}</Tooltip>
                  )}>
                  <span className="textEllipsis">
                    {transaction.transactionNarrative}
                  </span>
                </OverlayTrigger>
              </td>
              <td>
                {transaction.transactionId}
                {
                  transaction.transactionRelatedTransactionId &&
                  <Badge pill variant="success">{transaction.transactionRelatedTransactionId}</Badge>
                }
              </td>
              <td>
                <ButtonGroup>
                  <Button variant="link" size="sm"
                  onClick={() => props.onEditTransaction(transaction.transactionId)}>Edit</Button>
                  <Button variant="link" size="sm"
                  onClick={() => props.onDeleteTransaction(transaction.transactionId)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTable;
