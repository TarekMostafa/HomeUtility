import React from 'react';
import { connect } from 'react-redux';

function BillStatusesDropDown(props) {
  return props.billStatuses && props.billStatuses.map( (status) => {
    return (
      <option key={status} value={status}>{status}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    billStatuses: state.lookups.billStatuses
	}
}

export default connect(mapStateToProps)(BillStatusesDropDown)
