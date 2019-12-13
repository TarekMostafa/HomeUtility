import React from 'react';
import { connect } from 'react-redux';

function BillFrequenciesDropDown(props) {
  return props.billFrequencies && props.billFrequencies.map( (frequency) => {
    return (
      <option key={frequency} value={frequency}>{frequency}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    billFrequencies: state.lookups.billFrequencies
	}
}

export default connect(mapStateToProps)(BillFrequenciesDropDown)
