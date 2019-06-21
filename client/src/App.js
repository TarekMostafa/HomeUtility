import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';

import './App.css';

import NavigationBar from './components/navigation/NavigationBar'
import Home from './components/home/Home';
import WealthAccountList from './components/wealth/accounts/WealthAccountList';
import WealthDepositList from './components/wealth/deposits/WealthDepositList';
import WealthTransactionList from './components/wealth/transactions/WealthTransactionList';
import WealthBankList from './components/wealth/banks/WealthBankList';
import CurrencyList from './components/currencies/CurrencyList';
import WealthTransactionTypeList from './components/wealth/transactiontypes/WealthTransactionTypeList';
import AppSettings from './components/settings/AppSettings';
import ChangePassword from './components/auth/ChangePassword';
import ChangeUserName from './components/auth/ChangeUserName';
import MonthlyStatistics from './components/statistics/MonthlyStatistics';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <NavigationBar />
          <Container fluid>
            {
              this.props.user ?
              <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/accounts" exact component={WealthAccountList}></Route>
                <Route path="/deposits" exact component={WealthDepositList}></Route>
                <Route path="/accountstransactions" exact component={WealthTransactionList}></Route>
                <Route path="/banks" exact component={WealthBankList}></Route>
                <Route path="/currencies" exact component={CurrencyList}></Route>
                <Route path="/transactiontypes" exact component={WealthTransactionTypeList}></Route>
                <Route path="/appsettings" exact component={AppSettings}></Route>
                <Route path="/changepassword" exact component={ChangePassword}></Route>
                <Route path="/ChangeUserName" exact component={ChangeUserName}></Route>
                <Route path="/statistics" exact component={MonthlyStatistics}></Route>
              </Switch> :
              <Switch>
                <Route path="/" component={Home}></Route>
              </Switch>
            }
          </Container>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(App);
