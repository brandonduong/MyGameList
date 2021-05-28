import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {useAuth} from '../context/auth/AuthContext'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})`padding-bottom: 5px`

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

function Links() {
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
                            { isAuthenticated &&
                                <Item>
                                    <Link to="/secret" className="nav-link">
                                        Secret
                                    </Link>
                                </Item>
                            }
                        </List>
                    </Collapse>
                </React.Fragment>
    )
}

export default Links
