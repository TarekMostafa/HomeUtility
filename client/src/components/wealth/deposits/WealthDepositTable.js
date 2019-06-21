import React from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthDepositTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Reference</th>
          <th>Currency</th>
          <th>Amount</th>
          <th>Equivalent Amount</th>
          <th>Status</th>
          <th>Rate</th>
          <th>StartDate</th>
          <th>EndDate</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.deposits && props.deposits.map( (deposit, index) => {
          return (
            <tr key={deposit.id} className={deposit.status==="CLOSED"?"table-danger":""}>
              <td>{index+1}</td>
              <td>{deposit.bank.bankName}</td>
              <td>{deposit.reference}</td>
              <td>{deposit.currencyCode}</td>
              <td className="text-right">
                {amountFormatter(deposit.amount, deposit.currency.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(deposit.amount * deposit.currency.currencyRateAgainstBase,
                props.appSettings.currency.currencyDecimalPlace)}
              </td>
              <td>{deposit.status}</td>
              <td>{deposit.rate}</td>
              <td>
                {
                  deposit.startDate ?
                  moment(deposit.startDate).format('DD/MM/YYYY') : ''
                }
              </td>
              <td>
                {
                  deposit.endDate ?
                  moment(deposit.endDate).format('DD/MM/YYYY') : ''
                }
              </td>
              <td>
                <ButtonGroup>
                  <Button variant="link" size="sm"
                  onClick={() => props.onDeleteDeposit(deposit.id)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings,
	}
}

export default connect(mapStateToProps)(WealthDepositTable);
