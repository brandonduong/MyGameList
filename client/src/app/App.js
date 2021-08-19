import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Profile, Login, SignUp, GameInfo, SearchResults, GameList } from '../pages/index';
import { NavBar, WithAuth } from "../components/index";

import 'bootstrap/dist/css/bootstrap.min.css'
import AuthProvider from '../context/auth/AuthContext'
import GoogleAds from "../components/GoogleAds";
import {Col, Container, Row} from "react-bootstrap";

export default class App extends Component {
    componentDidMount(){ document.body.style.backgroundColor = '#c0d7d7' }

  render() {
        return (
            <div className={'general-container'}>
                <AuthProvider>
                    <Router>
                      <NavBar />
                      <Container fluid>
                        <Row>
                            <Col>
                                <GoogleAds slot={'6180999739'} />
                            </Col>
                            <Col xs={8}>
                              <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/profile/:profileUser" exact component={Profile} />
                                <Route path="/profile/:profileUser/:listName" exact component={GameList} />
                                <Route path="/login" exact component={Login}/>
                                <Route path="/signup" exact component={SignUp}/>
                                <Route path="/game/:gameId" exact component={GameInfo}/>
                                <Route path="/search" exact component={SearchResults}/>
                              </Switch>
                            </Col>
                            <Col>
                                <GoogleAds slot={'6180999739'} />
                            </Col>
                        </Row>
                      </Container>
                        {/*<GoogleAds slot={'6180999739'} />*/}
                    </Router>
                </AuthProvider>
            </div>
        );
  }
}
