import React, { useState } from 'react';
import {
  Button, Card, Col, Container, Form, Nav, Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/auth/AuthContext';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

function Login(props) {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(showPassword === false);
  }

  const { dispatch } = useAuth();

  const { username, password } = user;

  const onChange = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const history = useHistory();

  function onLogin(event) {
    event.preventDefault();
    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: 'login',
            payload: user.username,
          });
          history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  const loginForm = (
    <Form onSubmit={onLogin}>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="username"
          name="username"
          placeholder="Enter username"
          value={username}
          onChange={onChange}
          required
          maxLength={20}
        />
        <Form.Label style={{ marginTop: 10 }}>Password:</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={onChange}
              required
              maxLength={50}
            />
          </Col>
          <Col
            xs={1}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i
              onClick={togglePasswordVisibility}
            >
              {showPassword ? eye : eyeSlash}
            </i>
          </Col>
        </Row>
        <br />
      </Form.Group>
      <Button type="submit" className="submit-button">Login</Button>
    </Form>
  );

  return (
    <Container style={{ paddingTop: 75 }}>
      <Card style={{ width: '50%', left: '25%' }}>
        <Card.Header>
          <h1>Login to existing account</h1>
        </Card.Header>

        <Card.Body>
          {loginForm}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
