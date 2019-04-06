import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container'

import NavigationBar from './components/navigation/NavigationBar'
import Home from './components/home/Home';
import WealthTransactionSearch from './components/wealth/transactions/WealthTransactionSearch';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <Container>
          <Router>
            <Switch>
              <Route path="/" exact component={Home}></Route>
              <Route path="/accountstransactions" exact component={WealthTransactionSearch}></Route>
            </Switch>
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
