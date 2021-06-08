import React, {useState} from 'react';
import {Button, Card, Container, Form, Nav} from "react-bootstrap";
import {useHistory} from "react-router";
import {useAuth} from "../context/auth/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

function Login(props) {
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    function togglePasswordVisibility() {
        setShowPassword(showPassword === false)
    }

    const {dispatch} = useAuth()

    const { username, password } = user;

    const onChange = e => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const history = useHistory()

    function onLogin(event) {
        event.preventDefault();
        fetch('/api/authenticate', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: 'login',
                        payload: user.username
                    })
                    history.push('/');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    const loginForm =
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
                />
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={onChange}
                    required/>
                {/*
                <i onClick={togglePasswordVisibility} style={{position: "relative",
                    display: "flex",
                    marginTop: 6}}>{eye}</i>
                */}
                <br></br>
            </Form.Group>
            <Button type="submit" variant="dark">Login</Button>
        </Form>


    return (
        <Container style={{paddingTop: 25}}>
            <Card style={{width: '50%', left: '25%', padding: 0}}>
                <Card.Header>
                    <h2>Login to existing account</h2>
                </Card.Header>

                <Card.Body>
                    {loginForm}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login
