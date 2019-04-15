import React, { Component } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

import UserRequest from '../../axios/UserRequest';

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
      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered {...this.props} backdrop={'static'} onShow={this.handleOnShow}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="input" placeholder="User Name" maxLength={20}
              name="userName" value={this.state.userName} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"
              name="password" value={this.state.password} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Text className={'text-danger'}>{this.state.message}</Form.Text>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Login'
          }
          </Button>
        </Modal.Footer>
      </Modal>
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
    .then( (result) => {
      this.setState({
        message: result.data,
        isLoading: false,
      })
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
