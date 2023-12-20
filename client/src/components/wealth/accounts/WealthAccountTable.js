import React from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthAccountTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Account Number</th>
          <th>Currency</th>
          <th>Start Balance</th>
          <th>Current Balance</th>
          <th>Equivalent Balance</th>
          <th>Status</th>
          <th>Balance Last Update</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.accounts && props.accounts.map( (account, index) => {
          return (
            <tr key={account.accountId} className={account.accountStatus==="CLOSED"?"table-danger":""}>
              <td>{index+1}</td>
              <td>{account.bankName}</td>
              <td>{account.accountNumber}</td>
              <td>{account.accountCurrency}</td>
              <td className="text-right">
                {amountFormatter(account.accountStartBalance, account.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(account.accountCurrentBalance, account.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(account.accountCurrentBalance * account.currencyRateAgainstBase,
                props.appSettings.currency.currencyDecimalPlace)}
              </td>
              <td>{account.accountStatus}</td>
              <td>
                {
                  account.accountLastBalanceUpdate ?
                  moment(account.accountLastBalanceUpdate).format('DD/MM/YYYY HH:mm:ss') :
                  ''
                }
              </td>
              <td>
                <ButtonGroup>
                  <Button variant="link" size="sm"
                  onClick={() => props.onEditAccount(account.accountId)}>Edit</Button>
                  <Button variant="link" size="sm"
                  onClick={() => props.onDeleteAccount(account.accountId)}>Delete</Button>
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

export default connect(mapStateToProps)(WealthAccountTable);
