import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Secret } from '../pages/index';
import { NavBar, Login, WithAuth } from "../components/index";

import 'bootstrap/dist/css/bootstrap.min.css'
import AuthProvider from '../context/auth/AuthContext'

export default class App extends Component {
  render() {
        return (
            <AuthProvider>
                <Router>
                  <NavBar />
                  <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/secret" exact component={WithAuth(Secret)} />
                    <Route path="/login" exact component={Login}/>
                  </Switch>
                </Router>
            </AuthProvider>
        );
  }
}
