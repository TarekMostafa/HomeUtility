import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function LookupsNavDropDown(props) {
  return (
    <NavDropdown title="Lookups" id="basic-nav-dropdown">
      <LinkContainer to="/currencies">
        <NavDropdown.Item>Currencies</NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  )
}

export default LookupsNavDropDown;
