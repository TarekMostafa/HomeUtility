import React, {Component} from 'react';
import { Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BankRequest from '../../../axios/BankRequest';
import EditCancelButton from '../../common/EditCancelButton';

class WealthBankTableRow extends Component {
  state = {
    editMode: false,
    bankName: this.props.bank.bankName,
    messageClass: '',
    message: '',
    isEditLoading: false,
    isDeleteLoading: false,
    isDisabled: false
  }
  render () {
    const { bank, index } = this.props;
    return (
      <tr key={bank.bankCode}>
        <td>{index+1}</td>
        <td>{bank.bankCode}</td>
        <td>
          { this.state.editMode?
            <Form.Control type="input" size="sm" value={this.state.bankName}
            name="bankName" onChange={this.handleChange} maxLength={45}/>
            : this.state.bankName
          }
        </td>
        <td>
          <Row>
            <Col xs={4}>
              <EditCancelButton onEditClick={this.handleEditClick}
              onCancelClick={this.handleCancelClick}
              disabled={this.state.isDisabled}
              isLoading={this.state.isEditLoading}
              editMode={this.state.editMode}/>
            </Col>
            <Col xs={2}>
              <Button variant="danger" size="sm" name={'btndelete'+bank.bankCode}
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
      BankRequest.updateBank(this.props.bank.bankCode, this.state.bankName)
      .then((result) => {
        if (typeof this.props.onEditBank=== 'function') {
          this.props.onEditBank();
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
    BankRequest.deleteBank(this.props.bank.bankCode)
    .then((result) => {
      if (typeof this.props.onDeleteBank=== 'function') {
        this.props.onDeleteBank();
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

WealthBankTableRow.propTypes = {
  onEditBank: PropTypes.func,
  onDeleteBank: PropTypes.func
}

export default WealthBankTableRow;
