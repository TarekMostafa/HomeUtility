import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import UserRequest from '../../axios/UserRequest';

const initialState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  isLoading: false,
  messageClass: '',
  message: '',
}

class Login extends Component {
  state = {
    ...initialState
  }
  render() {
    return (
      <FormContainer title="Change Password">
        <Form.Group controlId="formBasicCurrentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control type="password"
          name="currentPassword" value={this.state.currentPassword}
          onChange={this.handleChange}/>
        </Form.Group>
        <Form.Group controlId="formBasicNewPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password"
          name="newPassword" value={this.state.newPassword}
          onChange={this.handleChange}/>
        </Form.Group>
        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password"
          name="confirmPassword" value={this.state.confirmPassword}
          onChange={this.handleChange}/>
        </Form.Group>
        <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
        <Button variant="primary" onClick={this.handleClick}>
        {
          this.state.isLoading?
          <Spinner as="span" animation="border" size="sm" role="status"
          aria-hidden="true"/> : 'Save'
        }
        </Button>
      </FormContainer>
    );
  }//end for render

  handleClick = () => {
    if(this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        messageClass: 'text-danger',
        message: 'Confirm password must be equal to New password',
      });
      return;
    }
    this.setState({isLoading: true});
    UserRequest.changePassword(this.props.user.userId, this.state.currentPassword,
    this.state.newPassword)
    .then( (result) => {
      this.setState({
        message: result.data,
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
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(Login);
