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
    const value = currency.currencyName;
    const key = currency.currencyCode;
    let style = {"font-weight":""};
    if(props.selectedData.includes(key)) style["font-weight"]="bold";
    return (
      <option key={key} value={key} style={{...style}}
      decimalplaces={currency.currencyDecimalPlace}
      onClick={()=>typeof(props.onSelect)==='function' && props.onSelect(key, value)}>
        {value}
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
  status: PropTypes.string,
  onSelect: PropTypes.func,
  selectedData: PropTypes.array,
}

CurrenciesDropDown.defaultProps = {
  status: "YES",
  selectedData: [],
}

export default connect(mapStateToProps)(CurrenciesDropDown)
