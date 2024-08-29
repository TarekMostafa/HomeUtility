import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

// import amountFormatter from '../../../utilities/amountFormatter';

function DebtorTotalBalance (props) {
  return (
    <Alert variant='primary'>
      <Row>
        <Col md={{span:3, offset:3}}>
          Total Debtors Balance: <strong>
          {
            // props.debtors && amountFormatter(props.debtors.reduce( (result, debtor) => {
            //   result += debtor.Balance * debtor.currencyRateAgainstBase
            //   return result;
            // }, 0), props.decimalPlace) + ' ' + props.baseCurrency
            props.debtors && props.formattedTotal + ' ' + props.baseCurrency
          } </strong>
        </Col>
        <Col md="3">
          Total Number of Debtors: <strong>
          {
            props.debtors && props.debtors.reduce( result => {
              result += 1
              return result;
            }, 0)
          } </strong>
        </Col>
      </Row> 
    </Alert>
  )
}

DebtorTotalBalance.propTypes = {
    debtors: PropTypes.arrayOf(PropTypes.object),
    baseCurrency: PropTypes.string,
    formattedTotal: PropTypes.string,
    //decimalPlace: PropTypes.number,
};

DebtorTotalBalance.defaultProps = {
    debtors: [],
    baseCurrency: '',
    formattedTotal: '0',
    // decimalPlace: 2,
}

export default DebtorTotalBalance;
