import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Profile, Login, SignUp } from '../pages/index';
import { NavBar, WithAuth } from "../components/index";

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
                    <Route path="/profile" exact component={Profile} />
                    <Route path="/login" exact component={Login}/>
                    <Route path="/signup" exact component={SignUp}/>
                  </Switch>
                </Router>
            </AuthProvider>
        );
  }
}
