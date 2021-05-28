import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import {useHistory} from "react-router";

function SignUp(props) {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const { username, email, password } = user;

    const onChange = e => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const history = useHistory()

    function onSubmit(event) {
        event.preventDefault();
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    history.push('/login');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error signing up please try again');
            });
    }

    return (
        <Container fluid={"sm"}>
            <form onSubmit={onSubmit}>
                <h1>Signup Below!</h1>
                <h3>Username:</h3>
                <input
                    type="username"
                    name="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={onChange}
                    required
                />
                <h3>Email address:</h3>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <h3>Password:</h3>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={onChange}
                    required
                />
                <br></br>
                <input type="submit" value="Submit"/>
            </form>
        </Container>
    );
}

export default SignUp
