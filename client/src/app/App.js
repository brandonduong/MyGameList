import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Secret from '../pages/Secret';
import NavBar from "../components/NavBar";

import 'bootstrap/dist/css/bootstrap.min.css'

export default class App extends Component {
  render() {
    return (
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/secret" exact component={Secret} />
          </Switch>
        </Router>
    );
  }
}
