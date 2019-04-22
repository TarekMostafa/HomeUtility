import React from 'react';
import { connect } from 'react-redux';

function AccountStatusesDropDown(props) {
  return props.accountStatuses && props.accountStatuses.map( (status) => {
    return (
      <option key={status} value={status}>{status}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    accountStatuses: state.lookups.accountStatuses
	}
}

export default connect(mapStateToProps)(AccountStatusesDropDown)
