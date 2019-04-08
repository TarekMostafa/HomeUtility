import React from 'react';
import { Table, Button } from 'react-bootstrap';

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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.currencies && props.currencies.map( (currency, index) => {
          return (
            <tr key={currency.currencyCode}>
              <td>{index+1}</td>
              <td>{currency.currencyCode}</td>
              <td>{currency.currencyName}</td>
              <td>{currency.currencyRateAgainstBase}</td>
              <td>{currency.currencyDecimalPlace}</td>
              <td>
                {
                  currency.currencyActive === 'YES' ?
                  <Button variant="danger" size="sm"
                  onClick={ () => props.onDeactivate(currency.currencyCode)}>Deactivate</Button> :
                  <Button variant="primary" size="sm"
                  onClick={ () => props.onActivate(currency.currencyCode)}>Activate</Button>
                }
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CurrencyTable;
