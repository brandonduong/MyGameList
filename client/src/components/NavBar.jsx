import React from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, DropdownButton, Navbar, Dropdown} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

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
                    user &&
                    <DropdownButton variant="secondary" title={user + " "}>
                        <Dropdown.Item href={"/profile/" + user} className={"nav-link"}>Profile</Dropdown.Item>
                        <Dropdown.Item href={"/"} className={"nav-link"}>Account Settings</Dropdown.Item>
                        <Dropdown.Item href={"/"} className={"nav-link"} onClick={logout}>Logout</Dropdown.Item>
                    </DropdownButton>
                }
            </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default NavBar
