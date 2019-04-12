import React, { Component } from 'react';
//import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import WealthBankTable from './WealthBankTable';
import WealthBankAddForm from './WealthBankAddForm';
import FormContainer from '../../common/FormContainer';
import { getBanks } from '../../../store/actions/lookupsAction';
//const initialState = {
//}

class WealthBankList extends Component {
  state = {
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Banks">
          <WealthBankAddForm onAddBank={this.handleAddBank}/>
        </FormContainer>
        <WealthBankTable banks={this.props.banks}/>
      </React.Fragment>
    )
  }//end of render

  handleAddBank = () => {
    this.props.getBanks();
  }
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
