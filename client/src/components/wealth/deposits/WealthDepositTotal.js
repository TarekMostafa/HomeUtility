import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthDepositTotal (props) {
  return (
    <Card className="text-center" border="primary" style={{ width: '18rem' }}>
      <Card.Header><strong>Total Deposits</strong></Card.Header>
      <Card.Body>
        <Card.Text>
          {
            props.deposits && amountFormatter(props.deposits.reduce( (result, deposit) => {
              if(deposit.status==='ACTIVE') {
                result += deposit.amount * deposit.currencyRateAgainstBase;
              }
              return result;
            }, 0), props.decimalPlace) + ' ' + props.baseCurrency
          }
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

WealthDepositTotal.propTypes = {
  deposits: PropTypes.arrayOf(PropTypes.object),
  baseCurrency: PropTypes.string,
  decimalPlace: PropTypes.number,
};

WealthDepositTotal.defaultProps = {
  deposits: [],
  baseCurrency: '',
  decimalPlace: 2,
}

export default WealthDepositTotal;
