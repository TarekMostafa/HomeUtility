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
      return account.accountStatus === props.status;
    })
  }
  if(props.bank) {
    accounts = accounts.filter( (account) => {
      return account.accountBankCode === props.bank;
    })
  }
  return accounts.map( (account) => {
    const value = `${account.accountNumber} - ${account.bankName} - ${account.accountCurrency}`;
    const key = account.accountId;
    const display = account.accountNumber;
    let style = {"fontWeight":"","backgroundColor":"default"};
    if(props.selectedData.includes(key)) style["fontWeight"]="bold";
    if(account.accountStatus === 'CLOSED') style["backgroundColor"]="lightgray";
    return (
      <option key={key} value={key} style={{...style}}
      decimalplaces={account.currencyDecimalPlace} currency={account.accountCurrency}
      onClick={()=>typeof(props.onSelect)==='function' && props.onSelect(key, display)}>
      {value}
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
  onSelect: PropTypes.func,
  selectedData: PropTypes.array,
};

AccountsDropDown.defaultProps = {
  status: '',
  selectedData: [],
}

export default connect(mapStateToProps)(AccountsDropDown)
