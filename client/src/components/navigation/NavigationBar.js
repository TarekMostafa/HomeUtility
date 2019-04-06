import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function NavigationBar(props){
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Navbar.Brand href="/">Home Utility</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav>
          <NavDropdown title="Modules" id="basic-nav-dropdown">
            <NavDropdown.Item href="/accountstransactions">Accounts Transactions</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar;
