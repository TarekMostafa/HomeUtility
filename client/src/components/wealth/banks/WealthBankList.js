import React, { Component } from 'react';
//import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import WealthBankTable from './WealthBankTable';
import FormContainer from '../../common/FormContainer';

//const initialState = {
//}

class WealthBankList extends Component {
  state = {
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Banks" />
        <WealthBankTable banks={this.props.banks}/>
      </React.Fragment>
    )
  }//end of render
}

const mapStateToProps = (state) => {
	return {
		banks: state.lookups.banks
	}
}

export default connect(mapStateToProps)(WealthBankList);
