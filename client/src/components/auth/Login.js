import React, { Component } from 'react';
import { Navbar, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import LoginModal from './LoginModal';
import { setUser } from '../../store/actions/authActions';
import UserRequest from '../../axios/UserRequest';
import interceptor from '../../axios/Interceptor';

class Login extends Component {
  state = {
    modalShow: false,
  }
  render() {
    return (
      <Navbar.Text>
        {
          this.props.user?
          <NavDropdown title={this.props.user.userName} id="basic-nav-dropdown">
            <LinkContainer to="/changeusername">
              <NavDropdown.Item >Change User Name</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/changepassword">
              <NavDropdown.Item >Change Password</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={this.handleLogoutClick}>Logout</NavDropdown.Item>
          </NavDropdown>
          :
          <React.Fragment>
            <Button variant="link" onClick={this.handleLoginClick}>Login</Button>
            <LoginModal show={this.state.modalShow} onHide={this.handleHide}/>
          </React.Fragment>
        }
      </Navbar.Text>
    );
  }//end for render

  handleLogoutClick = () => {
    UserRequest.logout(this.props.user.userId)
    .then( (response) => {
      this.props.setUser(null);
      interceptor.removeInterceptor();
      localStorage.removeItem("user");
    })
    .catch( (err) => {

    })
  }

  handleLoginClick = () => {
    this.setState({modalShow: true});
  }

  handleHide = () => {
    this.setState({modalShow: false});
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
