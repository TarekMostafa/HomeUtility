import React from 'react';
import { Table } from 'react-bootstrap';

function WealthTransactionTypeTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>Type Id</th>
          <th>Type Name</th>
          <th>Credit/Debit</th>
        </tr>
      </thead>
      <tbody>
        {props.transactionTypes && props.transactionTypes.map( (transactionType, index) => {
          return (
            <tr key={transactionType.typeId}>
              <td>{transactionType.typeId}</td>
              <td>{transactionType.typeName}</td>
              <td>{transactionType.typeCRDR}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTypeTable;
