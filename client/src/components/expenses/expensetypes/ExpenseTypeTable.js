import React from 'react';
import { Table } from 'react-bootstrap';

import ExpenseTypeTableRow from './ExpenseTypeTableRow';
import ExpenseTypeModel from './ExpenseTypeModel';

function ExpenseTypeTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>Expense Type Id</th>
          <th>Expense Type Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.expenseTypes && props.expenseTypes.map( (expenseType, index) => {
          let expenseTypeModel = new ExpenseTypeModel(expenseType);
          return (
            <ExpenseTypeTableRow expenseType={expenseTypeModel} index={index}
            key={expenseTypeModel.expenseTypeId}
            {...props}/>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ExpenseTypeTable;
