import React from 'react';
import { connect } from 'react-redux';

function CurrenciesDropDown(props) {
  return props.currencies && props.currencies.map( (currency) => {
    return (
      <option key={currency.currencyCode} value={currency.currencyCode}>{currency.currencyName}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    currencies: state.lookups.activeCurrencies,
	}
}

export default connect(mapStateToProps)(CurrenciesDropDown)
