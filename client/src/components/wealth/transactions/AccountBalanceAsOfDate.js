import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function AccountBalanceAsOfDate (props) {
  return (
    <Alert variant='primary'>
      <Row>
        <Col md={{span:4, offset:4}}>
          Total Balance: <strong>
          {
            amountFormatter(props.balance, props.currencyDecimalPlace) + ' ' + props.currency
          } </strong> as of <strong>{props.balanceDate}</strong>
        </Col>
      </Row> 
    </Alert>
  )
}

AccountBalanceAsOfDate.propTypes = {
  balance: PropTypes.string,
  currency: PropTypes.string,
  currencyDecimalPlace: PropTypes.number,
  balanceDate: PropTypes.string,
};

AccountBalanceAsOfDate.defaultProps = {
  balance: '0',
  currency: '',
  currencyDecimalPlace: 0,
  balanceDate: '',
}

export default AccountBalanceAsOfDate;
