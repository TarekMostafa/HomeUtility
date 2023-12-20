import React, {Component} from 'react';
import { Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CurrencyRequest from '../../axios/CurrencyRequest';
import EditDeleteButton from '../common/EditDeleteButton';

const initialState = {
  mode: 'None',
  messageClass: '',
  message: '',
  isLoading: false,
  isDisabled: false,
}

class CurrencyTableRow extends Component {
  state = {
    manualRate: this.props.currency.currencyManualRateAgainstBase,
    ...initialState
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
          {
            this.state.mode === 'Edit' ?
            <Form.Control type="input" size="sm" value={Number(this.state.manualRate).toFixed(7)}
            name="manualRate" onChange={this.handleChange}/>
            : currency.currencyManualRateAgainstBase
          }
        </td>
        <td>
          <Row>
            <Col xs={6}>
              {
                currency.currencyActive === 'YES' ?
                <React.Fragment>
                  <EditDeleteButton onEditClick={this.handleEditClick}
                  onDeleteClick={this.handleDeactivateClick}
                  onCancelClick={this.handleCancelClick}
                  disabled={this.state.isDisabled}
                  isLoading={this.state.isLoading}
                  mode={this.state.mode}
                  deleteLabel={'Deactivate'}
                  confirmDeleteLabel={'Confirm Deactivation'}/>
                </React.Fragment>
                :
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

  handleCancelClick = () => {
    this.setState({
      ...initialState
    });
  }

  handleEditClick = () => {
    if(this.state.mode === 'Edit') {
      this.setState({isLoading: true, isDisabled: true});
      CurrencyRequest.updateCurrency(this.props.currency.currencyCode, this.state.manualRate)
      .then((result) => {
        if (typeof this.props.onUpdate=== 'function') {
          this.props.onUpdate();
        }
        this.setState({
          ...initialState
        });
      })
      .catch( err => {
        this.setState({
          message: err.response.data,
          messageClass: 'text-danger',
          isLoading: false,
          isDisabled: false
        })
      })
    } else {
      this.setState({
        mode: 'Edit',
        message: '',
        messageClass: ''
      })
    }
  }

  handleDeactivateClick = () => {
    if(this.state.mode === 'Delete') {
      this.setState({isLoading: true, isDisabled: true});
      CurrencyRequest.deactivateCurrency(this.props.currency.currencyCode)
      .then( () => {
        if (typeof this.props.onDeactivate=== 'function') {
          this.props.onDeactivate();
        }
        this.setState({
          ...initialState,
        });
      })
      .catch( err => {
        this.setState({
          message: err.response.data,
          messageClass: 'text-danger',
          isLoading: false,
          isDisabled: false
        })
      })
    } else {
      this.setState({
        mode: 'Delete',
        message: '',
        messageClass: ''
      })
    }
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }
}

CurrencyTableRow.propTypes = {
  onDeactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onUpdate: PropTypes.func
}

export default CurrencyTableRow;
