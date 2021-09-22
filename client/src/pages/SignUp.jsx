import React, { useState } from 'react';
import {
  Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

function SignUp(props) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });

  const {
    username, email, password, confirm,
  } = user;

  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(showPassword === false);
  }

  const onChange = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const history = useHistory();

  function onSignup(event) {
    event.preventDefault();
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          history.push('/login');
        } else {
          return res.json();
        }
      }).then((data) => {
        if (data) {
          console.log(data);
          const error = new Error(data.error);
          throw error;
        }
    })
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  }

  const signupForm = (
    <Form onSubmit={onSignup}>
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
        <Form.Label style={{ marginTop: 10 }}>Email address:</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          value={email}
          onChange={onChange}
          required
          maxLength={50}
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
            <i onClick={togglePasswordVisibility}>
              {showPassword ? eye : eyeSlash}
            </i>
          </Col>
        </Row>
        <Form.Label style={{ marginTop: 10 }}>Confirm password:</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              name="confirm"
              placeholder="Confirm password"
              value={confirm}
              onChange={onChange}
              required
              maxLength={50}
            />
          </Col>
          <Col
            xs={1}
          />
        </Row>
        <br />
      </Form.Group>
      <Button type="submit" className="submit-button" variant="dark">Sign Up</Button>
    </Form>
  );

  return (
    <Container style={{ paddingTop: 75 }}>
      <Card style={{ width: '50%', left: '25%' }}>
        <Card.Header>
          <h1>Create new account</h1>
        </Card.Header>

        <Card.Body>
          {signupForm}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignUp;
