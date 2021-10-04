import React from 'react';
import { connect } from 'react-redux';
import ExpenseTypeTable from './ExpenseTypeTable';
import ExpenseTypeAddForm from './ExpenseTypeAddForm';
import FormContainer from '../../common/FormContainer';
import { getExpenseTypes } from '../../../store/actions/lookupsAction';

function ExpenseTypeList(props) {
  return (
    <React.Fragment>
      <FormContainer title="Expense Types">
        <ExpenseTypeAddForm onAddExpenseType={() => props.getExpenseTypes()}/>
      </FormContainer>
      <FormContainer>
        <ExpenseTypeTable expenseTypes={props.expenseTypes}
        onEditExpenseType={() => props.getExpenseTypes()}
        onDeleteExpenseType={() => props.getExpenseTypes()}/>
      </FormContainer>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
	return {
		expenseTypes: state.lookups.expenseTypes
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getExpenseTypes: () => dispatch(getExpenseTypes()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseTypeList);
