import React from 'react';
import { connect } from 'react-redux';

function TransactionTypesDropDown(props) {
  return props.transactionTypes && props.transactionTypes.map( (transactionType) => {
    return (
      <option key={transactionType.typeId} value={transactionType.typeId}>
        {transactionType.typeName}</option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(TransactionTypesDropDown)
