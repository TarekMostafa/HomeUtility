import React from 'react';
import { Table } from 'react-bootstrap';

function WealthBankTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Code</th>
          <th>Bank Name</th>
        </tr>
      </thead>
      <tbody>
        {props.banks && props.banks.map( (bank, index) => {
          return (
            <tr key={bank.bankCode}>
              <td>{index+1}</td>
              <td>{bank.bankCode}</td>
              <td>{bank.bankName}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthBankTable;
