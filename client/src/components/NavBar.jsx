import React, { Component } from 'react'
import styled from 'styled-components'

import Logo from './Logo'
import Links from './Links'
import {Navbar} from "react-bootstrap";


class NavBar extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <Logo />
                    MyVideoGameList
                </Navbar.Brand>
                <Links />
            </Navbar>
        )
    }
}

export default NavBar
