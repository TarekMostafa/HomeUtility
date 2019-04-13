import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import LoginModal from './LoginModal';

class Login extends Component {
  state = {
    modalShow: false,
  }
  render() {
    return (
      <Navbar.Text>
        <Button variant="link" onClick={this.handleClick}>Login</Button>
        <LoginModal show={this.state.modalShow} onHide={this.handleHide}/>
      </Navbar.Text>
    );
  }//end for render

  handleClick = () => {
    this.setState({modalShow: true});
  }

  handleHide = () => {
    this.setState({modalShow: false});
  }
}

export default Login;
