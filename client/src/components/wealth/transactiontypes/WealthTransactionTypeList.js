import React, { Component } from 'react';
//import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import WealthTransactionTypeTable from './WealthTransactionTypeTable';
import FormContainer from '../../common/FormContainer';

//const initialState = {
//}

class WealthTransactionTypeList extends Component {
  state = {
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Transaction Types" />
        <WealthTransactionTypeTable transactionTypes={this.props.transactionTypes}/>
      </React.Fragment>
    )
  }//end of render
}

const mapStateToProps = (state) => {
	return {
		transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(WealthTransactionTypeList);
