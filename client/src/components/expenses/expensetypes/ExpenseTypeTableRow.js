import React, {Component} from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ExpenseTypeRequest from '../../../axios/ExpenseTypeRequest';
import EditDeleteButton from '../../common/EditDeleteButton';

const initialState = {
  mode: 'None',
  messageClass: '',
  message: '',
  isLoading: false,
  isDisabled: false,
}

class ExpenseTypeTableRow extends Component {
  state = {
    expenseTypeName: this.props.expenseType.expenseTypeName,
    ...initialState
  }
  render () {
    const { expenseType } = this.props;
    return (
      <tr key={expenseType.expenseTypeId}>
        <td>{expenseType.expenseTypeId}</td>
        <td>
          { this.state.mode === 'Edit' ?
            <Form.Control type="input" size="sm" value={this.state.expenseTypeName}
            name="expenseTypeName" onChange={this.handleChange} maxLength={45}/>
            : this.state.expenseTypeName
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
      ExpenseTypeRequest.updateExpenseType(this.props.expenseType.expenseTypeId,
        this.state.expenseTypeName)
      .then((result) => {
        if (typeof this.props.onEditExpenseType=== 'function') {
          this.props.onEditExpenseType();
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
      ExpenseTypeRequest.deleteExpenseType(this.props.expenseType.expenseTypeId)
      .then((result) => {
        if (typeof this.props.onDeleteExpenseType=== 'function') {
          this.props.onDeleteExpenseType();
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

ExpenseTypeTableRow.propTypes = {
  onEditExpenseType: PropTypes.func,
  onDeleteExpenseType: PropTypes.func
}

export default ExpenseTypeTableRow;
