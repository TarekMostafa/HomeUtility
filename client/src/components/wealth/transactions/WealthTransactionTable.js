import React from 'react';
import { Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import moment from 'moment';
import '../../../App.css';

function WealthTransactionTable (props) {
  return (
    <Table hover size="sm" responsive="sm">
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
        {props.transactions && props.transactions.map( (transaction, index) => {
          return (
            <tr key={transaction.transactionId}>
              <td>{index+1}</td>
              <td>{transaction.account.accountNumber}</td>
              <td>{moment(transaction.transactionPostingDate).format('DD/MM/YYYY')}</td>
              <td>{new Intl.NumberFormat().format(transaction.transactionAmount)}</td>
              <td>{transaction.account.acccountCurrency}</td>
              <td>{transaction.transactionCRDR}</td>
              <td>{transaction.transactionType.typeName}</td>
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
              <td>{transaction.transactionId}</td>
              {/*<td>
                {transaction.transactionRelatedTransactionId !== null ? <Button variant="link">Linked</Button> : null}
              </td>*/}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTable;
