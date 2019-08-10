import React from 'react';
import { Table, Button } from 'react-bootstrap';
import '../../../App.css';

function RelatedTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>Description</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          props.relatedTransactions && props.relatedTransactions.map(
            (relatedTransactions, index) => {
          return (
            <tr key={relatedTransactions.relatedTransactionsId}>
              <td>{index+1}</td>
              <td>
                {
                  relatedTransactions.relatedType.typeDescription +
                  ' (' + relatedTransactions.relatedTransactionType + ')'
                }
              </td>
              <td>{relatedTransactions.relatedTransactionDesc}</td>
              <td>{relatedTransactions.relatedTransactionsId}</td>
              <td>
                <Button variant="link" size="sm"
                onClick={() => props.onDetails(relatedTransactions.relatedTransactionsId)}>
                Details
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default RelatedTransactionTable;
