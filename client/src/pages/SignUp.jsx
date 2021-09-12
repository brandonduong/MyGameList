import React, { useState } from 'react';
import {
  Button, Card, Container, Form,
} from 'react-bootstrap';
import { useHistory } from 'react-router';

function SignUp(props) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = user;

  const [showPassword, setShowPassword] = useState(false);

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
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error signing up please try again');
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
        <Form.Label>Email address:</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          value={email}
          onChange={onChange}
          required
          maxLength={50}
        />
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={onChange}
          required
          maxLength={50}
        />
        {/*
                <i onClick={togglePasswordVisibility} style={{position: "relative",
                    display: "flex",
                    marginTop: 6}}>{eye}</i>
                */}
        <br />
      </Form.Group>
      <Button type="submit" className="submit-button" variant="dark">Signup</Button>
    </Form>
  );

  return (
    <Container style={{ paddingTop: 75 }}>
      <Card style={{ width:'50%', left: '25%' }}>
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
