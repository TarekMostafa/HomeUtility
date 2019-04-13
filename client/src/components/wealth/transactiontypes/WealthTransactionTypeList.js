import React from 'react';
import { connect } from 'react-redux';
import WealthTransactionTypeTable from './WealthTransactionTypeTable';
import WealthTransactionTypeAddForm from './WealthTransactionTypeAddForm';
import FormContainer from '../../common/FormContainer';
import { getTransactionTypes } from '../../../store/actions/lookupsAction';

function WealthTransactionTypeList(props) {
  return (
    <React.Fragment>
      <FormContainer title="Transaction Types">
        <WealthTransactionTypeAddForm onAddTransactionType={() => props.getTransactionTypes()}/>
      </FormContainer>
      <FormContainer>
        <WealthTransactionTypeTable transactionTypes={props.transactionTypes}
        onEditTransactionType={() => props.getTransactionTypes()}
        onDeleteTransactionType={() => props.getTransactionTypes()}/>
      </FormContainer>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
	return {
		transactionTypes: state.lookups.transactionTypes
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getTransactionTypes: () => dispatch(getTransactionTypes()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WealthTransactionTypeList);
