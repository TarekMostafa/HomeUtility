import React from 'react';
import { Table } from 'react-bootstrap';

import WealthBankTableRow from './WealthBankTableRow';

function WealthBankTable(props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Code</th>
          <th>Bank Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.banks && props.banks.map( (bank, index) => {
          return (
            <WealthBankTableRow bank={bank} index={index} key={bank.bankCode}
            {...props}/>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthBankTable;
