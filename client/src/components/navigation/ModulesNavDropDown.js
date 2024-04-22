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
            <NavDropdown.Item>Summary</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/accountstransactions">
            <NavDropdown.Item>Transactions</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/relatedtransactions">
            <NavDropdown.Item>Related Transactions</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/accountbalanceasofdate">
            <NavDropdown.Item>Account Balance As Of Date</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-deposits'}>
          Deposits
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/deposits">
            <NavDropdown.Item>Summary</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-expenses'}>
          Expenses
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/expenseHeaderList">
            <NavDropdown.Item>Summary</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/expenseDetailSearchList">
            <NavDropdown.Item>Search</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-cards'}>
          Cards
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/cards">
            <NavDropdown.Item>Summary</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/cardsInstallments">
            <NavDropdown.Item>Installments</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/cardsTranactions">
            <NavDropdown.Item>Transactions</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/cardPayments">
            <NavDropdown.Item>Payment</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-expenses'}>
          Debts
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/debts/debtors">
            <NavDropdown.Item>Debtors Summary</NavDropdown.Item>
          </LinkContainer>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop={'right'}>
        <Dropdown.Toggle as={Nav.Link} id={'dropdown-bills'}>
          Bills
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer to="/bills">
            <NavDropdown.Item>Summary</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/billstransactions">
            <NavDropdown.Item>Transactions</NavDropdown.Item>
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
