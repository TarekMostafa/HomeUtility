import React, {Component} from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BankRequest from '../../../axios/BankRequest';
import EditDeleteButton from '../../common/EditDeleteButton';

const initialState = {
  mode: 'None',
  messageClass: '',
  message: '',
  isLoading: false,
  isDisabled: false,
}

class WealthBankTableRow extends Component {
  state = {
    bankName: this.props.bank.bankName,
    ...initialState
  }
  render () {
    const { bank, index } = this.props;
    return (
      <tr key={bank.bankCode}>
        <td>{index+1}</td>
        <td>{bank.bankCode}</td>
        <td>
          { this.state.mode === 'Edit' ?
            <Form.Control type="input" size="sm" value={this.state.bankName}
            name="bankName" onChange={this.handleChange} maxLength={45}/>
            : this.state.bankName
          }
        </td>
        <td>{bank.bankStatus}</td>
        <td>
          <Row>
            <Col xs={6}>
              <EditDeleteButton onEditClick={this.handleEditClick}
              onDeleteClick={this.handleDeleteClick}
              onCancelClick={this.handleCancelClick}
              disabled={this.state.isDisabled}
              isLoading={this.state.isLoading}
              mode={this.state.mode}/>
            </Col>
            <Col xs={2}>
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
      BankRequest.updateBank(this.props.bank.bankCode, this.state.bankName)
      .then((result) => {
        if (typeof this.props.onEditBank=== 'function') {
          this.props.onEditBank();
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

  handleDeleteClick = () => {
    if(this.state.mode === 'Delete') {
      this.setState({isLoading: true, isDisabled: true});
      BankRequest.deleteBank(this.props.bank.bankCode)
      .then((result) => {
        if (typeof this.props.onDeleteBank=== 'function') {
          this.props.onDeleteBank();
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }
}

WealthBankTableRow.propTypes = {
  onEditBank: PropTypes.func,
  onDeleteBank: PropTypes.func
}

export default WealthBankTableRow;
