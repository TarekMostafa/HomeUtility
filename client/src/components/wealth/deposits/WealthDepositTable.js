import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
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
          <th>Start Date</th>
          <th>End Date</th>
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
                <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="secondary">
                  <Dropdown.Item onClick={() => props.onDepositDetails(deposit)}>
                  Transactions
                  </Dropdown.Item>
                  {
                    deposit.status === 'ACTIVE' &&
                    <React.Fragment>
                      <Dropdown.Item onClick={() => props.onAddInterest(deposit.id)}>
                      Add Interest
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onReleaseDeposit(deposit.id)}>
                      Release
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onDeleteDeposit(deposit.id)}>
                      Delete
                      </Dropdown.Item>
                    </React.Fragment>
                  }
                </DropdownButton>
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
