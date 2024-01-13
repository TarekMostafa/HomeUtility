import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function TransactionTypesDropDown(props) {
  let transactionTypes = props.transactionTypes;
  if(transactionTypes) {
    transactionTypes = transactionTypes.filter( (transactionType) => {
      return !props.typeCRDR || transactionType.typeCRDR === props.typeCRDR;
    })
  }
  return transactionTypes && transactionTypes.map( (transactionType) => {
    const value = transactionType.typeName;
    const key = transactionType.typeId;
    let style = {"fontWeight":""};
    if(props.selectedData.includes(key)) style["fontWeight"]="bold";
    return (
      <option key={key} value={key} style={{...style}}
      onClick={()=>typeof(props.onSelect)==='function' && props.onSelect(key, value)}>
        {value}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

TransactionTypesDropDown.propTypes = {
  onSelect: PropTypes.func,
  selectedData: PropTypes.array,
}

TransactionTypesDropDown.defaultProps = {
  selectedData: [],
}

export default connect(mapStateToProps)(TransactionTypesDropDown)
