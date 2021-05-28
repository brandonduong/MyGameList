import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import {useHistory} from "react-router";
import {useAuth} from "../context/auth/AuthContext";

function Profile(props) {
    // Get context
    const {
        state: {user},
    } = useAuth()

    return (
        <Container fluid={"sm"}>
            User: {user}
        </Container>
    );
}

export default Profile
