import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ModulesNavDropDown from './ModulesNavDropDown';
import LookupsNavDropDown from './LookupsNavDropDown';
import AppNavDropDown from './AppNavDropDown';
import Login from '../auth/Login';

function NavigationBar(props){
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/"><Navbar.Brand>Home Utility</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav><ModulesNavDropDown /></Nav>
          <Nav><LookupsNavDropDown /></Nav>
          <Nav><AppNavDropDown /></Nav>
        </Navbar.Collapse>
        <Login />
      </Container>
    </Navbar>
  )
}

export default NavigationBar;
