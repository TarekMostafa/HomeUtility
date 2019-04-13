import React, {Component} from 'react';
import { Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CurrencyRequest from '../../axios/CurrencyRequest';

class CurrencyTableRow extends Component {
  state = {
    isLoading: false,
    messageClass: '',
    message: '',
  }
  render () {
    const { currency, index } = this.props;
    return (
      <tr key={currency.currencyCode}>
        <td>{index+1}</td>
        <td>{currency.currencyCode}</td>
        <td>{currency.currencyName}</td>
        <td>{currency.currencyRateAgainstBase}</td>
        <td>{currency.currencyDecimalPlace}</td>
        <td>
          <Row>
            <Col xs={2}>
              {
                currency.currencyActive === 'YES' ?
                <Button variant="danger" size="sm"
                onClick={this.handleDeactivateClick}
                disabled={this.state.isLoading}>
                  {
                    this.state.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Deactivate'
                  }
                </Button> :
                <Button variant="primary" size="sm"
                onClick={this.handleActivateClick}
                disabled={this.state.isLoading}>
                  {
                    this.state.isLoading?
                    <Spinner as="span" animation="border" size="sm" role="status"
                    aria-hidden="true"/> : 'Activate'
                  }
                </Button>
              }
            </Col>
            <Col>
              <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
            </Col>
          </Row>
        </td>
      </tr>
    )
  }//end of render

  handleDeactivateClick = () => {
    this.setState({
      isLoading: true,
      messageClass: '',
      message: '',
    });
    CurrencyRequest.deactivateCurrency(this.props.currency.currencyCode)
    .then( () => {
      if (typeof this.props.onDeactivate=== 'function') {
        this.props.onDeactivate();
      }
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger',
        isLoading: false
      })
    })
  }

  handleActivateClick = () => {
    this.setState({
      isLoading: true,
      messageClass: '',
      message: '',
    });
    CurrencyRequest.activateCurrency(this.props.currency.currencyCode)
    .then( () => {
      if (typeof this.props.onActivate=== 'function') {
        this.props.onActivate();
      }
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger',
        isLoading: false
      })
    })
  }
}

CurrencyTableRow.propTypes = {
  onDeactivate: PropTypes.func,
  onActivate: PropTypes.func
}

export default CurrencyTableRow;
