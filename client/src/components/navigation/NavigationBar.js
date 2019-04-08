import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ModulesNavDropDown from './ModulesNavDropDown';
import LookupsNavDropDown from './LookupsNavDropDown';

function NavigationBar(props){
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <LinkContainer to="/"><Navbar.Brand>Home Utility</Navbar.Brand></LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav>
          <ModulesNavDropDown />
        </Nav>
        <Nav>
          <LookupsNavDropDown />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar;
