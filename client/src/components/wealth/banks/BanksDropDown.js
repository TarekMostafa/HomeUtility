import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function BanksDropDown(props) {
  return props.banks && props.banks.map( (bank) => {
    const value = bank.bankName;
    const key = bank.bankCode;
    let style = {"fontWeight":"","backgroundColor":"default"};
    if(props.selectedData.includes(key)) style["fontWeight"]="bold";
    if(bank.bankStatus === 'INACTIVE') style["backgroundColor"]="lightgray";
    return (
      <option key={key} value={key} style={{...style}}
      onClick={()=>typeof(props.onSelect)==='function' && props.onSelect(key, value)}>
        {bank.bankStatus === 'INACTIVE'?`${value} - ${bank.bankStatus}`:value}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    banks: state.lookups.banks
	}
}

BanksDropDown.propTypes = {
  onSelect: PropTypes.func,
  selectedData: PropTypes.array,
}

BanksDropDown.defaultProps = {
  selectedData: [],
}

export default connect(mapStateToProps)(BanksDropDown)
