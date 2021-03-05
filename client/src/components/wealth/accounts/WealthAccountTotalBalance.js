import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthAccountTotalBalance (props) {
  return (
    // <Card className="text-center" border="primary" style={{ width: '18rem' }}>
    //   <Card.Header><strong>Total Current Balance</strong></Card.Header>
    //   <Card.Body>
    //     <Card.Text>
    //       {
    //         props.accounts && amountFormatter(props.accounts.reduce( (result, account) => {
    //           result += account.accountCurrentBalance * account.currency.currencyRateAgainstBase
    //           return result;
    //         }, 0), props.decimalPlace) + ' ' + props.baseCurrency
    //       }
    //     </Card.Text>
    //   </Card.Body>
    // </Card>
    <Alert variant='primary'>
      <Row>
        <Col md={{span:3, offset:3}}>
          Total Current Balance: <strong>
          {
            props.accounts && amountFormatter(props.accounts.reduce( (result, account) => {
              result += account.accountCurrentBalance * account.currency.currencyRateAgainstBase
              return result;
            }, 0), props.decimalPlace) + ' ' + props.baseCurrency
          } </strong>
        </Col>
        <Col md="3">
          Total Number of Accounts: <strong>
          {
            props.accounts && props.accounts.reduce( (result, account) => {
              result += 1
              return result;
            }, 0)
          } </strong>
        </Col>
      </Row> 
    </Alert>
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
