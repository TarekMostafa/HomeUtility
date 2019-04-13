import React, { Component } from 'react';
import { connect } from 'react-redux';

import CurrencyTable from './CurrencyTable';
import CurrencyAddForm from './CurrencyAddForm';
import FormContainer from '../common/FormContainer';
import AlertError from '../common/AlertError';
import CurrencyRequest from '../../axios/CurrencyRequest';
import { getActiveCurrencies } from '../../store/actions/lookupsAction';

class CurrencyList extends Component {
  state = {
    inActiveCurrencies: [],
    errorMessage: ''
  }

  loadInActiveCurrencies() {
    CurrencyRequest.getCurrencies('NO')
    .then( (currencies) => {
      this.setState({
        inActiveCurrencies: currencies
      })
    })
  }

  componentDidMount() {
    this.loadInActiveCurrencies();
  }

  render() {
    return (
      <React.Fragment>
        <AlertError message={this.state.errorMessage}/>
        <FormContainer title="Active Currencies">
          <CurrencyAddForm onAddCurrency={this.handleAddCurrency}/>
        </FormContainer>
        <FormContainer>
          <CurrencyTable currencies={this.props.activeCurrencies} onDeactivate={this.handleDeactivate}/>
        </FormContainer>
        <FormContainer title="Inactive Currencies" />
        <FormContainer>
          <CurrencyTable currencies={this.state.inActiveCurrencies} onActivate={this.handleActivate}/>
        </FormContainer>
      </React.Fragment>
    )
  }//end of render

  handleAddCurrency = () => {
    this.props.getActiveCurrencies();
  }

  handleDeactivate = () => {
    this.props.getActiveCurrencies();
    this.loadInActiveCurrencies();
  }

  handleActivate = () => {
    this.props.getActiveCurrencies();
    this.loadInActiveCurrencies();
  }

  setErrorTimeout = () => {
    setTimeout(() => {
      this.setState({errorMessage:''});
    },5000);
  }
}

const mapStateToProps = (state) => {
	return {
    activeCurrencies: state.lookups.activeCurrencies
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActiveCurrencies: () => dispatch(getActiveCurrencies())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyList);
