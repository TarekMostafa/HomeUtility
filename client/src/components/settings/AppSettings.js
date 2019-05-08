import React, { Component } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import DBBackup from './DBBackup';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import AppSettingsRequest from '../../axios/AppSettingsRequest';
import CurrencyRequest from '../../axios/CurrencyRequest';

import { getActiveCurrencies, getAppSettings } from '../../store/actions/lookupsAction';

const initialState = {
  message: '',
  messageClass: '',
  isSaveRateLoading: false,
  isUpdateRateLoading: false,
  isDisabled: false,
}

class AppSettings extends Component {
  state = {
    baseCurrency: '',
    apikey: '',
    ...initialState
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.appSettings && prevState.baseCurrency === '') {
      return {
        baseCurrency: nextProps.appSettings.baseCurrency,
        apikey: nextProps.appSettings.currencyConversionAPIKey
      }
    } else {
      return null
    }
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="App Settings">
          <Form>
            <Row>
              <Col xs={8}>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  <Form.Label column sm="6">Base Currency</Form.Label>
                  <Col sm="6">
                    <Form.Control as="select" size="sm" name="baseCurrency" onChange={this.handleChange}
                      value={this.state.baseCurrency}>
                      <option value=''></option>
                      <CurrenciesDropDown />
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  <Form.Label column sm="6">Currency Conversion API Key</Form.Label>
                  <Col sm="6">
                    <Form.Control type="input" size="sm"
                      value={this.state.apikey} name="apikey" readOnly/>
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Button variant="primary" size="sm" onClick={this.handleSave}
                disabled={this.state.isDisabled}>
                {
                  this.state.isSaveRateLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Save & Update Rates'
                }
                </Button>
              </Col>
              <Col xs={2}>
                <Button variant="primary" size="sm" onClick={this.handleUpdateRates}
                disabled={this.state.isDisabled}>
                {
                  this.state.isUpdateRateLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> :
                  this.props.appSettings? 'Update Rates (' +
                  this.props.appSettings.baseCurrency + ')' : 'Update Rates ()'
                }
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <DBBackup />
      </React.Fragment>
    )
  }//end of render

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handleSave = () => {
    // Dont save the baseCurrency if there is no change has been done
    if(this.state.baseCurrency === this.props.appSettings.baseCurrency) {
      return;
    }
    this.setState({
      isSaveRateLoading: true,
      isDisabled: true,
    });
    AppSettingsRequest.updateAppSettings(this.state.baseCurrency)
    .then( (result) => {
      this.props.getAppSettings();
      this.setState({
        ...initialState,
        message: result.data,
        messageClass: 'text-success',
        isSaveRateLoading: false,
        isDisabled: false,
      });
      this.props.getActiveCurrencies();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger',
        isSaveRateLoading: false,
        isDisabled: false,
      })
    })
  }

  handleUpdateRates = () => {
    this.setState({
      isUpdateRateLoading: true,
      isDisabled: true,
    });
    CurrencyRequest.updateRates()
    .then( (result) => {
      this.setState({
        ...initialState,
        message: result.data,
        messageClass: 'text-success',
        isUpdateRateLoading: false,
        isDisabled: false,
      });
      this.props.getActiveCurrencies();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger',
        isUpdateRateLoading: false,
        isDisabled: false,
      })
    })
  }
}

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActiveCurrencies: () => dispatch(getActiveCurrencies()),
    getAppSettings: () => dispatch(getAppSettings()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
