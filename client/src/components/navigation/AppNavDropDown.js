import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function AppNavDropDown(props) {
  return (
    <NavDropdown title="App" id="basic-nav-dropdown">
      <LinkContainer to="/appsettings">
        <NavDropdown.Item>Settings</NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  )
}

export default AppNavDropDown;
