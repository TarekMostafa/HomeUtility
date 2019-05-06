import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function ModulesNavDropDown(props) {
  return (
    <NavDropdown title="Modules" id="basic-nav-dropdown">
      <LinkContainer to="/accounts">
        <NavDropdown.Item>Accounts</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/accountstransactions">
        <NavDropdown.Item>Accounts Transactions</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/statistics">
        <NavDropdown.Item>Statistics</NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  )
}

export default ModulesNavDropDown;
