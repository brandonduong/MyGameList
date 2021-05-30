import React from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, Navbar} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";

function NavBar() {
    // Get context
    const {
        state: {user},
    } = useAuth()

    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid={"sm"}>
                <Logo />
            <Navbar.Brand href="/">
                MyVideoGameList
            </Navbar.Brand>
            <Links />
            <Navbar.Brand href={"/profile/" + user}> {user} </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default NavBar
