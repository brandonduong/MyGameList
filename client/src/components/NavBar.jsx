import React from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, DropdownButton, Navbar, Dropdown, NavDropdown, Nav} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";
import {SearchBar} from "./index";

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
        <Navbar bg="dark"  variant="dark">
            <Container fluid={"sm"}>
                <Logo />
                <Navbar.Brand href="/">
                    MyGameList
                </Navbar.Brand>
                <Links />
                <SearchBar/>
                <Nav className="mr-auto">
                {
                    user &&
                    <NavDropdown id="basic-nav-dropdown" variant="dark" title={user + " "}>
                        <NavDropdown.Item href={"/profile/" + user}>Profile</NavDropdown.Item>
                        <NavDropdown.Item href={"/"}>Account Settings</NavDropdown.Item>
                        <NavDropdown.Item href={"/"} onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                }
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar
