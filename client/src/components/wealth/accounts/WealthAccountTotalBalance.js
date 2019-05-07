import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthAccountTotalBalance (props) {
  return (
    <Card className="text-center" border="primary" style={{ width: '18rem' }}>
      <Card.Header><strong>Total Current Balance</strong></Card.Header>
      <Card.Body>
        <Card.Text>
          {
            props.accounts && amountFormatter(props.accounts.reduce( (result, account) => {
              result += account.accountCurrentBalance * account.currency.currencyRateAgainstBase
              return result;
            }, 0), props.decimalPlace) + ' ' + props.baseCurrency
          }
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

WealthAccountTotalBalance.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  baseCurrency: PropTypes.string,
  decimalPlace: PropTypes.number,
};

WealthAccountTotalBalance.defaultProps = {
  accounts: [],
  baseCurrency: '',
  decimalPlace: 2,
}

export default WealthAccountTotalBalance;
