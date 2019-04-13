import React from 'react';
import { connect } from 'react-redux';
import WealthBankTable from './WealthBankTable';
import WealthBankAddForm from './WealthBankAddForm';
import FormContainer from '../../common/FormContainer';
import { getBanks } from '../../../store/actions/lookupsAction';

function WealthBankList (props) {
  return (
    <React.Fragment>
      <FormContainer title="Banks">
        <WealthBankAddForm onAddBank={() => props.getBanks()}/>
      </FormContainer>
      <FormContainer>
        <WealthBankTable banks={props.banks} onEditBank={() => props.getBanks()}
        onDeleteBank={() => props.getBanks()}/>
      </FormContainer>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
	return {
		banks: state.lookups.banks
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    getBanks: () => dispatch(getBanks()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WealthBankList);
