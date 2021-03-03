import React, {Component} from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TransactionTypeRequest from '../../../axios/TransactionTypeRequest';
import EditDeleteButton from '../../common/EditDeleteButton';

const initialState = {
  mode: 'None',
  messageClass: '',
  message: '',
  isLoading: false,
  isDisabled: false,
}

class WealthTransactionTypeTableRow extends Component {
  state = {
    typeName: this.props.transactionType.typeName,
    typeCRDR: this.props.transactionType.typeCRDR,
    ...initialState
  }
  render () {
    const { transactionType } = this.props;
    return (
      <tr key={transactionType.typeId}>
        <td>{transactionType.typeId}</td>
        <td>
          { this.state.mode === 'Edit' ?
            <Form.Control type="input" size="sm" value={this.state.typeName}
            name="typeName" onChange={this.handleChange} maxLength={45}/>
            : this.state.typeName
          }
        </td>
        <td>
          { this.state.mode === 'Edit' ?
            <Form.Control as="select" size="sm" name="typeCRDR" onChange={this.handleChange}
              value={this.state.typeCRDR}>
              <option value=''>Credit/Debit</option>
              <option value='Credit'>Credit</option>
              <option value='Debit'>Debit</option>
            </Form.Control> : this.state.typeCRDR
          }
        </td>
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
      TransactionTypeRequest.updateTransactionType(this.props.transactionType.typeId,
        this.state.typeName, this.state.typeCRDR)
      .then((result) => {
        if (typeof this.props.onEditTransactionType=== 'function') {
          this.props.onEditTransactionType();
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
      TransactionTypeRequest.deleteTransactionType(this.props.transactionType.typeId)
      .then((result) => {
        if (typeof this.props.onDeleteTransactionType=== 'function') {
          this.props.onDeleteTransactionType();
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

WealthTransactionTypeTableRow.propTypes = {
  onEditTransactionType: PropTypes.func,
  onDeleteTransactionType: PropTypes.func
}

export default WealthTransactionTypeTableRow;
