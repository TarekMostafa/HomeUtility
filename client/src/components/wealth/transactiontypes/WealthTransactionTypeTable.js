import React from 'react';
import { Table } from 'react-bootstrap';

import WealthTransactionTypeTableRow from './WealthTransactionTypeTableRow';

function WealthTransactionTypeTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>Type Id</th>
          <th>Type Name</th>
          <th>Credit/Debit</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.transactionTypes && props.transactionTypes.map( (transactionType, index) => {
          return (
            <WealthTransactionTypeTableRow transactionType={transactionType} index={index}
            key={transactionType.typeId}
            {...props}/>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTypeTable;
