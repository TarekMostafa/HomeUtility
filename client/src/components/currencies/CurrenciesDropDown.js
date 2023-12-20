import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function CurrenciesDropDown(props) {

  let { currencies, status } = props;
  if(currencies && status) {
    currencies = currencies.filter(currency => {
      return (currency.currencyActive === status || status==='');
    })
  }

  return currencies && currencies.map( (currency) => {
    return (
      <option key={currency.currencyCode} value={currency.currencyCode}
      decimalplaces={currency.currencyDecimalPlace}>
        {currency.currencyName}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    currencies: state.lookups.currencies,
	}
}

CurrenciesDropDown.propTypes = {
  status: PropTypes.string
};

CurrenciesDropDown.defaultProps = {
  status: "YES"
}

export default connect(mapStateToProps)(CurrenciesDropDown)
