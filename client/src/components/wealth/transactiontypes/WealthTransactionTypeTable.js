import React from 'react';
import { Table } from 'react-bootstrap';

import WealthTransactionTypeTableRow from './WealthTransactionTypeTableRow';
import TransactionTypeModel from './TransactionTypeModel';

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
          let transactionTypeModel = new TransactionTypeModel(transactionType);
          return (
            <WealthTransactionTypeTableRow transactionType={transactionTypeModel} index={index}
            key={transactionTypeModel.typeId}
            {...props}/>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTypeTable;
