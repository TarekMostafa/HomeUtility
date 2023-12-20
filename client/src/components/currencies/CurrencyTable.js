import React from 'react';
import { Table } from 'react-bootstrap';

import CurrencyTableRow from './CurrencyTableRow';

function CurrencyTable (props) {
  return (
    <Table hover size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Code</th>
          <th>Name</th>
          <th>Rate</th>
          <th>Decimal Place</th>
          <th>Manual Rate</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.currencies && props.currencies.map( (currency, index) => {
          return (
            <CurrencyTableRow currency={currency} index={index} key={currency.currencyCode}
            {...props}/>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CurrencyTable;
