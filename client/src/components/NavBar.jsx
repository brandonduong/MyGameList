import React, {useEffect} from 'react'

import Logo from './Logo'
import Links from './Links'
import {Container, DropdownButton, Navbar, Dropdown, NavDropdown, Nav, Col, Row, NavbarBrand} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";
import {SearchBar} from "./index";
import {useHistory} from "react-router";

function NavBar() {
    // Get context
    const {
        state: {user},
        dispatch
    } = useAuth()

    const history = useHistory()

    const onLink = (url) => (event) => {
        event.preventDefault()
        history.push(url)
    }

    function logout() {
        dispatch({
            type: 'logout',
        })
        localStorage.clear();
        history.push('/')
    }

    useEffect(() =>
    {
        console.log("update user state")
    }, [user]
    )

    return (
        <Navbar variant="dark" className={"nav-bar"}>
            <Container fluid={'sm'}>
                <Logo />
                <NavbarBrand onClick={onLink("/")} style={{ cursor: 'pointer'}}>
                    MyGameList
                </NavbarBrand>
                <Links />
                <Row>
                    <Col>
                    <SearchBar/>
                    </Col>
                    <Col xs={'auto'}>
                        <Nav className="mr-auto">
                        {
                            user &&
                            <NavDropdown id="basic-nav-dropdown" variant="dark" title={user + " "}>
                                <NavDropdown.Item onClick={onLink("/profile/" + user)}>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={onLink("/")}>Account Settings</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        }
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}

export default NavBar
