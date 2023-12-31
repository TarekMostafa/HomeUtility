import React from 'react';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';

function DebtorsDropDown(props) {
  let {activeDebtors} = props;
  if(!activeDebtors) {
    return null;
  }

  if(props.currency) {
    activeDebtors = activeDebtors.filter( (debtor) => {
      return debtor.Currency === props.currency;
    })
  }

  return activeDebtors.map( (debtor) => {
    const value = `${debtor.Name} - ${debtor.Currency}`;
    const key = debtor.Id;
    return (
      <option key={key} value={key}>
      {value}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    activeDebtors: state.lookups.activeDebtors
	}
}

DebtorsDropDown.propTypes = {
};

DebtorsDropDown.defaultProps = {
};

export default connect(mapStateToProps)(DebtorsDropDown)
