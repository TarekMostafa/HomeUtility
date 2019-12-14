import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function BillsDropDown(props) {
  let {bills} = props;
  if(!bills) {
    return null;
  }
  if(props.status){
    bills = bills.filter( (bill) => {
      return bill.billStatus === props.status;
    })
  }
  return bills.map( (bill) => {
    return (
      <option key={bill.billId} value={bill.billId} status={bill.billStatus}
      currency={bill.billCurrency} frequency={bill.billFrequency}
      decimalplaces={bill.currency.currencyDecimalPlace}
      defaultAmount={bill.billDefaultAmount}>
        {bill.billName}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    bills: state.lookups.bills,
	}
}

BillsDropDown.propTypes = {
  status: PropTypes.string,
};

BillsDropDown.defaultProps = {
  status: '',
}

export default connect(mapStateToProps)(BillsDropDown)
