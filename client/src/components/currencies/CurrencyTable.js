import React from 'react';
import { Table } from 'react-bootstrap';

import CurrencyTableRow from './CurrencyTableRow';
import NoData from '../common/NoData';

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
        {
          props.currencies && props.currencies.length === 0 && 
          <tr>
            <th colSpan={7}><NoData /></th>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default CurrencyTable;
