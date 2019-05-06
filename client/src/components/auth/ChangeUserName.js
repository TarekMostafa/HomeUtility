import React, { Component } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import UserRequest from '../../axios/UserRequest';
import { setUser } from '../../store/actions/authActions';

const initialState = {
  userName: '',
  isLoading: false,
  messageClass: '',
  message: '',
}

class ChangeUserName extends Component {
  state = {
    ...initialState
  }

  constructor(props) {
    super(props);
    this.state.userName = props.user.userName;
  }

  render() {
    return (
      <FormContainer title="Change User Name">
        <Form.Group controlId="formBasicUserName">
          <Form.Label>User Name</Form.Label>
          <Form.Control type="input"
          name="userName" value={this.state.userName}
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
    if(!this.state.userName) {
      this.setState({
        messageClass: 'text-danger',
        message: 'Invalid user name, must not be empty',
      });
      return;
    }
    this.setState({isLoading: true});
    UserRequest.changeUserName(this.props.user.userId, this.state.userName)
    .then( (result) => {
      this.setState({
        message: result.data,
        messageClass: 'text-success',
        isLoading: false
      });
      let _user = {...this.props.user};
      _user.userName = this.state.userName;
      this.props.setUser(_user);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserName);
