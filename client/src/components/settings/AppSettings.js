import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import AppSettingsRequest from '../../axios/AppSettingsRequest';
import CurrencyRequest from '../../axios/CurrencyRequest';

import { getActiveCurrencies } from '../../store/actions/lookupsAction';

const initialState = {
  message: '',
  messageClass: '',
}

class AppSettings extends Component {
  state = {
    baseCurrency: '',
    ...initialState
  }

  componentDidMount() {
    AppSettingsRequest.getAppSettings()
    .then( (appSettings) => {
      this.setState({
        ...initialState,
        baseCurrency: appSettings.baseCurrency,
      });
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger'
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="App Settings">
          <Form>
            <Row>
              <Col xs={6}>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="4">Base Currency</Form.Label>
                <Col sm="8">
                  <Form.Control as="select" size="sm" name="baseCurrency" onChange={this.handleChange}
                    value={this.state.baseCurrency}>
                    <option value=''></option>
                    { this.listCurrencies() }
                  </Form.Control>
                </Col>
                </Form.Group>
              </Col>
              <Col xs={{offset:2, span: 2}}>
                <Button variant="primary" size="sm" onClick={this.handleUpdateRates}>Update Rates</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
              </Col>
              <Col>
                <Button variant="primary" size="sm" onClick={this.handleSave}>Save</Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
      </React.Fragment>
    )
  }//end of render

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  listCurrencies = () => {
    return this.props.currencies && this.props.currencies.map( (currency) => {
      return (
        <option key={currency.currencyCode} value={currency.currencyCode}>{currency.currencyName}</option>
      )
    });
  }

  handleSave = () => {
    AppSettingsRequest.updateAppSettings(this.state.baseCurrency)
    .then( (result) => {
      this.setState({
        ...initialState,
        message: result.data,
        messageClass: 'text-success'
      });
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger'
      })
    })
  }

  handleUpdateRates = () => {
    CurrencyRequest.updateRates()
    .then( (result) => {
      this.setState({
        ...initialState,
        message: result.data,
        messageClass: 'text-success'
      });
      this.props.getActiveCurrencies();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger'
      })
    })
  }
}

const mapStateToProps = (state) => {
	return {
		currencies: state.lookups.activeCurrencies
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActiveCurrencies: () => dispatch(getActiveCurrencies())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
