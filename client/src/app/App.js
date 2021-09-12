import React, {Component, useEffect, useState} from 'react';
import {BrowserRouter as Router, HashRouter, Route, Switch} from 'react-router-dom';
import {
  Home, Profile, Login, SignUp, GameInfo, SearchResults, GameList,
} from '../pages/index';
import { NavBar, WithAuth } from '../components/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from '../context/auth/AuthContext';
import GoogleAds from '../components/GoogleAds';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = '#c0d7d7';
  }, []);

  return (
    <div className="general-container">
      <AuthProvider>
        <HashRouter>
          <NavBar />
          <Container fluid>
            {/*
              <Row>
                <Col>
                    <GoogleAds slot={'6180999739'} />
                </Col>
                <Col xs={12} lg={8}>
                */}
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/profile/:profileUser" exact component={Profile} />
              <Route path="/profile/:profileUser/:listName" exact component={GameList} />
              <Route path="/login" exact component={Login} />
              <Route path="/signup" exact component={SignUp} />
              <Route path="/game/:gameId" exact component={GameInfo} />
              <Route path="/search" exact component={SearchResults} />
            </Switch>
            {/*
                </Col>
                <Col>
                    <GoogleAds slot={'6180999739'} />
                </Col>
              </Row>
              */}
          </Container>
          {/* <GoogleAds slot={'6180999739'} /> */}
        </HashRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
