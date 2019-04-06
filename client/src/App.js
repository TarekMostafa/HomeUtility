import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container'

import NavigationBar from './components/navigation/NavigationBar'
import Home from './components/home/Home';
import WealthAccountList from './components/wealth/accounts/WealthAccountList';
import WealthTransactionList from './components/wealth/transactions/WealthTransactionList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <Container>
          <Router>
            <Switch>
              <Route path="/" exact component={Home}></Route>
              <Route path="/accounts" exact component={WealthAccountList}></Route>
              <Route path="/accountstransactions" exact component={WealthTransactionList}></Route>
            </Switch>
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
