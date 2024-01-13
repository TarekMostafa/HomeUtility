import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function AccountStatusesDropDown(props) {
  return props.accountStatuses && props.accountStatuses.map( (status) => {
    let style = {"fontWeight":""};
    if(props.selectedData.includes(status)) style["fontWeight"]="bold";
    return (
      <option key={status} value={status} style={{...style}}
      onClick={()=>typeof(props.onSelect)==='function' && props.onSelect(status, status)}>
        {status}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    accountStatuses: state.lookups.accountStatuses
	}
}

AccountStatusesDropDown.propTypes = {
  onSelect: PropTypes.func,
  selectedData: PropTypes.array,
}

AccountStatusesDropDown.defaultProps = {
  status: "YES",
  selectedData: [],
}

export default connect(mapStateToProps)(AccountStatusesDropDown)
