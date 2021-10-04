import React from 'react';
import { connect } from 'react-redux';

function ExpenseTypesDropDown(props) {
  let expenseTypes = props.expenseTypes;
  return expenseTypes && expenseTypes.map( (expenseType) => {
    return (
      <option key={expenseType.expenseTypeId} value={expenseType.expenseTypeId}>
        {expenseType.expenseTypeName}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    expenseTypes: state.lookups.expenseTypes
	}
}

export default connect(mapStateToProps)(ExpenseTypesDropDown)
