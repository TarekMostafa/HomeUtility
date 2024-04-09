import React from 'react';
import { Alert, Button, Spinner, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../utilities/amountFormatter';

function ExpenseTotalAccountDebitDifference (props) {
    return (
        <Alert variant='danger'>
            <Row>
                <Col md={{span:4, offset:4}}>
                Total Account Debit Difference: <strong>
                    {
                        amountFormatter(props.amount, props.decimalPlace) + ' ' + props.currency
                    }
                </strong>
                </Col>
                <Col>
                {
                    props.onApply && <Button variant="dark" size="sm" 
                    onClick={props.onApply}>
                    {
                    props.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Apply'
                    }
                    </Button>
                }  
                </Col>
            </Row>
        </Alert>
    );
}

ExpenseTotalAccountDebitDifference.propTypes = {
    amount: PropTypes.number,
    decimalPlace: PropTypes.number,
    currency: PropTypes.string,
    isLoading: PropTypes.bool,
    onApply: PropTypes.func,
};
  
ExpenseTotalAccountDebitDifference.defaultProps = {
    amount: 0,
    decimalPlace: 0,
    currency: '',
    isLoading: false,
    onApply: null,
}
  
export default ExpenseTotalAccountDebitDifference;