import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {useAuth} from '../context/auth/AuthContext'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

function Links() {
    // Get context
    const {
        state: {isAuthenticated},
    } = useAuth()

    console.log(isAuthenticated)

    return (
                <React.Fragment>
                    <Collapse>
                        <List>
                            <Item>
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </Item>
                        </List>
                        { isAuthenticated ?
                            <List>
                                <Item>
                                    <Link to="/secret" className="nav-link">
                                        Secret
                                    </Link>
                                </Item>
                            </List>

                            :

                            <List>
                                <Item>
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/signup" className="nav-link">
                                        Sign Up
                                    </Link>
                                </Item>
                            </List>
                        }
                    </Collapse>
                </React.Fragment>
    )
}

export default Links
