import React from 'react';
import { connect } from 'react-redux';

function BanksDropDown(props) {
  return props.banks && props.banks.map( (bank) => {
    return (
      <option key={bank.bankCode} value={bank.bankCode}>{bank.bankName}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    banks: state.lookups.banks
	}
}

export default connect(mapStateToProps)(BanksDropDown)
