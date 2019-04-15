import React, { Component } from 'react';
import { Navbar, Button, NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';

import LoginModal from './LoginModal';
import { setUser } from '../../store/actions/authActions';

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
    this.props.setUser(null);
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
