import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar(props){
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <LinkContainer to="/"><Navbar.Brand>Home Utility</Navbar.Brand></LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav>
          <NavDropdown title="Modules" id="basic-nav-dropdown">
            <LinkContainer to="/accounts">
              <NavDropdown.Item>Accounts</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/accountstransactions">
              <NavDropdown.Item>Accounts Transactions</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar;
