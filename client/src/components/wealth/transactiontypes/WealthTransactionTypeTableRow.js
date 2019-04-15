import React, {Component} from 'react';
import { Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TransactionTypeRequest from '../../../axios/TransactionTypeRequest';
import EditCancelButton from '../../common/EditCancelButton';

class WealthTransactionTypeTableRow extends Component {
  state = {
    editMode: false,
    typeName: this.props.transactionType.typeName,
    typeCRDR: this.props.transactionType.typeCRDR,
    messageClass: '',
    message: '',
    isEditLoading: false,
    isDeleteLoading: false,
    isDisabled: false
  }
  render () {
    const { transactionType } = this.props;
    return (
      <tr key={transactionType.typeId}>
        <td>{transactionType.typeId}</td>
        <td>
          { this.state.editMode?
            <Form.Control type="input" size="sm" value={this.state.typeName}
            name="typeName" onChange={this.handleChange} maxLength={45}/>
            : this.state.typeName
          }
        </td>
        <td>
          { this.state.editMode?
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
              <EditCancelButton onEditClick={this.handleEditClick}
              onCancelClick={this.handleCancelClick}
              disabled={this.state.isDisabled}
              isLoading={this.state.isEditLoading}
              editMode={this.state.editMode}/>
            </Col>
            <Col xs={2}>
              <Button variant="danger" size="sm" name={'btndelete'+transactionType.typeId}
              onClick={this.handleDeleteClick} disabled={this.state.isDisabled}>
              {
                this.state.isDeleteLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : 'Delete'
              }
              </Button>
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
      editMode: false
    });
  }

  handleEditClick = () => {
    if(this.state.editMode) {
      this.setState({isEditLoading: true, isDisabled: true});
      TransactionTypeRequest.updateTransactionType(this.props.transactionType.typeId,
        this.state.typeName, this.state.typeCRDR)
      .then((result) => {
        if (typeof this.props.onEditTransactionType=== 'function') {
          this.props.onEditTransactionType();
        }
        this.setState({
          editMode: false,
          message: 'Done',
          messageClass: 'text-success',
          isEditLoading: false,
          isDisabled: false
        });
      })
      .catch( err => {
        this.setState({
          message: err.response.data,
          messageClass: 'text-danger',
          isEditLoading: false,
          isDisabled: false
        })
      })
    } else {
      this.setState({
        editMode: true,
        message: '',
        messageClass: ''
      })
    }
  }

  handleDeleteClick = () => {
    this.setState({isDeleteLoading: true, isDisabled: true});
    TransactionTypeRequest.deleteTransactionType(this.props.transactionType.typeId)
    .then((result) => {
      if (typeof this.props.onDeleteTransactionType=== 'function') {
        this.props.onDeleteTransactionType();
      }
      this.setState({
        message: '',
        messageClass: '',
        isDeleteLoading: false,
        isDisabled: false
      });
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        messageClass: 'text-danger',
        isDeleteLoading: false,
        isDisabled: false
      })
    })
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
