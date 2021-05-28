import React from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, Navbar} from "react-bootstrap";
import {useAuth} from '../context/auth/AuthContext'

function NavBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid={"sm"}>
                <Logo />
            <Navbar.Brand href="/">
                MyVideoGameList
            </Navbar.Brand>
            <Links />
            </Container>
        </Navbar>
    )
}

export default NavBar
