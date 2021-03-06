import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import ModalContainer from '../common/ModalContainer'
import UserRequest from '../../axios/UserRequest';
import loadUser from '../../utilities/loadUser';

const initialState = {
  userName: '',
  password: '',
  message: '',
  isLoading: false,
}

class LoginModal extends Component {
  state = {
    ...initialState
  }
  render () {
    return (
      <ModalContainer title="Login" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Login'
          }
          </Button>
        }>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="input" maxLength={20}
            name="userName" value={this.state.userName}
            onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"
            name="password" value={this.state.password}
            onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
          </Form.Group>
          <Form.Text className={'text-danger'}>{this.state.message}</Form.Text>
        </Form>
      </ModalContainer>
    )
  }//end of render

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleKeyPress = (target) => {
    if(target.charCode===13){
      this.handleClick();
    }
  }

  handleClick = () => {
    // Validate Input
    if(this.state.userName === '') {
      this.setState({
        message: 'Invalid User Name, should not be empty'
      });
      return;
    } else if(this.state.password === '') {
      this.setState({
        message: 'Invalid Password, should not be empty'
      });
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Authenticate user name and password
    UserRequest.authenticate(this.state.userName, this.state.password)
    .then( (response) => {
      loadUser(response.data);
      this.props.onHide();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        isLoading: false,
      })
    })
  }
}

export default LoginModal;
