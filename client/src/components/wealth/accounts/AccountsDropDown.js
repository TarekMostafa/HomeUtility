import React from 'react';
import { connect } from 'react-redux';

function AccountsDropDown(props) {
  return props.accounts && props.accounts.map( (account) => {
    return (
      <option key={account.accountId} value={account.accountId}>{account.accountNumber}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    accounts: state.lookups.accounts
	}
}

export default connect(mapStateToProps)(AccountsDropDown)
