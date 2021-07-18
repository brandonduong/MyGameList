import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Profile, Login, SignUp, GameInfo, SearchResults, GameList } from '../pages/index';
import { NavBar, WithAuth } from "../components/index";

import 'bootstrap/dist/css/bootstrap.min.css'
import AuthProvider from '../context/auth/AuthContext'

export default class App extends Component {
  render() {
        return (
            <div className={'general-container'}>
                <AuthProvider>
                    <Router>
                      <NavBar />
                      <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/profile/:profileUser" exact component={Profile} />
                        <Route path="/profile/:profileUser/:listName" exact component={GameList} />
                        <Route path="/login" exact component={Login}/>
                        <Route path="/signup" exact component={SignUp}/>
                        <Route path="/game/:gameId" exact component={GameInfo}/>
                        <Route path="/search" exact component={SearchResults}/>
                      </Switch>
                    </Router>
                </AuthProvider>
            </div>
        );
  }
}
