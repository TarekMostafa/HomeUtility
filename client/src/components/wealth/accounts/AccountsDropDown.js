import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function AccountsDropDown(props) {
  let {accounts} = props;
  if(!accounts) {
    return null;
  }
  if(props.status) {
    accounts = accounts.filter( (account) => {
      console.log(account);
      return account.accountStatus === props.status;
    })
  }
  return accounts.map( (account) => {
    return (
      <option key={account.accountId} value={account.accountId}
      decimalplaces={account.currency.currencyDecimalPlace}>
      {account.accountNumber}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    accounts: state.lookups.accounts
	}
}

AccountsDropDown.propTypes = {
  status: PropTypes.string,
};

AccountsDropDown.defaultProps = {
  status: '',
}

export default connect(mapStateToProps)(AccountsDropDown)
