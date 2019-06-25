import React from 'react';
import { NavDropdown, Dropdown, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function ModulesNavDropDown(props) {
  return (
    <NavDropdown title="Modules" id="basic-nav-dropdown">
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-accounts'}>
          Accounts
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/accounts">
            <NavDropdown.Item>Accounts Summary</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/accountstransactions">
            <NavDropdown.Item>Accounts Transactions</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-accounts'}>
          Deposits
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/deposits">
            <NavDropdown.Item>Deposits Summary</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <LinkContainer to="/statistics">
        <NavDropdown.Item>Statistics</NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  )
}

export default ModulesNavDropDown;
