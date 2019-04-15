import React, { Component } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import UserRequest from '../../axios/UserRequest';
import { setUser } from '../../store/actions/authActions';

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
        centered show={this.props.show} onHide={this.props.onHide}
        backdrop={'static'} onShow={this.handleOnShow}>
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
    .then( (response) => {
      this.props.setUser(response.data);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    }
  }
}

export default connect(null, mapDispatchToProps)(LoginModal);
