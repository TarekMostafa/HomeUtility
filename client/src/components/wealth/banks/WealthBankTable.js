import React from 'react';
import { Table } from 'react-bootstrap';

import WealthBankTableRow from './WealthBankTableRow';
import BankModel from './BankModel';
import NoData from '../../common/NoData';

function WealthBankTable(props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Code</th>
          <th>Bank Name</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.banks && props.banks.map( (bank, index) => {
          let bankModel = new BankModel(bank);
          return (
            <WealthBankTableRow bank={bankModel} index={index} key={bankModel.bankCode}
            {...props}/>
          )
        })}
        {
          props.banks && props.banks.length === 0 && 
          <tr>
            <th colSpan={4}><NoData /></th>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default WealthBankTable;
