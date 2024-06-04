import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function FXTransactionStatistics (props) {
  return (
    <Alert variant='primary'>
      <Row>
        <Col md="3">
        {`${props.currency} FX In:`} <strong>
          {
            amountFormatter(props.fxInCurrencyTotal, props.currencyDecimalPlace)
          } </strong>
        </Col>
        <Col md="3">
        {`${props.againstCurrency} FX In:`} <strong>
          {
            amountFormatter(props.fxInAgainstCurrencyTotal, props.againstCurrencyDecimalPlace)
          } </strong>
        </Col>
        <Col md="3">
        {`Avg Conv.:`} <strong>{props.fxInAverage} </strong>
        </Col>
      </Row> 
      <Row>
        <Col md="3">
        {`${props.currency} FX Out:`} <strong>
          {
            amountFormatter(props.fxOutCurrencyTotal, props.currencyDecimalPlace)
          } </strong>
        </Col>
        <Col md="3">
        {`${props.againstCurrency} FX Out:`} <strong>
          {
            amountFormatter(props.fxOutAgainstCurrencyTotal, props.againstCurrencyDecimalPlace)
          } </strong>
        </Col>
        <Col md="3">
        {`Avg Conv.:`} <strong>{props.fxOutAverage} </strong>
        </Col>
      </Row> 
    </Alert>
  )
}

FXTransactionStatistics.propTypes = {
  currency: PropTypes.string,
  againstCurrency: PropTypes.string,
  currencyDecimalPlace: PropTypes.number,
  againstCurrencyDecimalPlace: PropTypes.number,
  fxInCurrencyTotal: PropTypes.number,
  fxInAgainstCurrencyTotal: PropTypes.number,
  fxOutCurrencyTotal: PropTypes.number,
  fxOutAgainstCurrencyTotal: PropTypes.number,
  fxInAverage: PropTypes.number,
  fxOutAverage: PropTypes.number
};

FXTransactionStatistics.defaultProps = {
  currency: '',
  againstCurrency: '',
  currencyDecimalPlace: 0,
  againstCurrencyDecimalPlace: 0,
  fxInCurrencyTotal: 0,
  fxInAgainstCurrencyTotal: 0,
  fxOutCurrencyTotal: 0,
  fxOutAgainstCurrencyTotal: 0,
  fxInAverage: 0,
  fxOutAverage: 0
}

export default FXTransactionStatistics;
