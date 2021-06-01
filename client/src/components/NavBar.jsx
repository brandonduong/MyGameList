import React from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, DropdownButton, Navbar, Dropdown} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";
import Logout from "./Logout";
import {Link} from "react-router-dom";

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
                MyGameList
            </Navbar.Brand>
            <Links />
            <Navbar.Brand>
                {
                    user && <DropdownButton variant="secondary" title={user + " "}>
                        <Dropdown.Item><Link to={"/profile/" + user} className={"nav-link"}>Profile</Link></Dropdown.Item>
                        <Dropdown.Item><Link to={"/"} className={"nav-link"}>Account Settings</Link></Dropdown.Item>
                        <Dropdown.Item><Logout /></Dropdown.Item>
                    </DropdownButton>
                }
            </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default NavBar
