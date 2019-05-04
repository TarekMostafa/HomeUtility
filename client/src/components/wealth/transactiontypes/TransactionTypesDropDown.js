import React from 'react';
import { connect } from 'react-redux';

function TransactionTypesDropDown(props) {
  let transactionTypes = props.transactionTypes;
  if(transactionTypes) {
    transactionTypes = transactionTypes.filter( (transactionType) => {
      return !props.typeCRDR || transactionType.typeCRDR === props.typeCRDR;
    })
  }
  return transactionTypes && transactionTypes.map( (transactionType) => {
    return (
      <option key={transactionType.typeId} value={transactionType.typeId}>
        {transactionType.typeName}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(TransactionTypesDropDown)
