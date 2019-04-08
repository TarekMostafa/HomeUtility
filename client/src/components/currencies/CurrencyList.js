import React, { Component } from 'react';
import { connect } from 'react-redux';
import CurrencyTable from './CurrencyTable';
import FormContainer from '../common/FormContainer';
import CurrencyRequest from '../../axios/CurrencyRequest';
import { getActiveCurrencies } from '../../store/actions/lookupsAction';

class CurrencyList extends Component {
  state = {
    inActiveCurrencies: [],
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
        <FormContainer title="Active Currencies" />
        <CurrencyTable currencies={this.props.activeCurrencies} onDeactivate={this.handleDeactivate}/>
        <FormContainer title="Inactive Currencies" />
        <CurrencyTable currencies={this.state.inActiveCurrencies} onActivate={this.handleActivate}/>
      </React.Fragment>
    )
  }//end of render

  handleDeactivate = (code) => {
    CurrencyRequest.deactivateCurrency(code)
    .then( () => {
      this.props.getActiveCurrencies();
      this.loadInActiveCurrencies();
    })
  }

  handleActivate = (code) => {
    CurrencyRequest.activateCurrency(code)
    .then( () => {
      this.props.getActiveCurrencies();
      this.loadInActiveCurrencies();
    })
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
