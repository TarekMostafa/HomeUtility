import React, {Component} from 'react';
import { Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BankRequest from '../../../axios/BankRequest';

class WealthBankTableRow extends Component {
  state = {
    editMode: false,
    bankName: this.props.bank.bankName,
    messageClass: '',
    message: '',
    isLoading: false,
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
            <Col xs={2}>
              <Button variant="primary" size="sm" name={'btnEdit'+bank.bankCode}
              onClick={this.handleEditClick} disabled={this.state.isLoading}>
              {
                this.state.isLoading?
                <Spinner as="span" animation="border" size="sm" role="status"
                aria-hidden="true"/> : this.state.editMode?'Save':'Edit'
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

  handleEditClick = () => {
    if(this.state.editMode) {
      this.setState({isLoading: true});
      BankRequest.updateBank(this.props.bank.bankCode, this.state.bankName)
      .then((result) => {
        if (typeof this.props.onEditBank=== 'function') {
          this.props.onEditBank();
        }
        this.setState({
          editMode: false,
          message: 'Done',
          messageClass: 'text-success',
          isLoading: false
        });
      })
      .catch( err => {
        this.setState({
          message: err.response.data,
          messageClass: 'text-danger',
          isLoading: false
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

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }
}

WealthBankTableRow.propTypes = {
  onEditBank: PropTypes.func,
}

export default WealthBankTableRow;
