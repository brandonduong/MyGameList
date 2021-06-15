import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../logo.svg'
import {useHistory} from "react-router";

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})`margin-left: -5px;
margin-right: 0`

function Logo() {

    const history = useHistory()

    const onLink = (url) => (event) => {
        event.preventDefault()
        history.push(url)
    }

    return (
            <Wrapper onClick={onLink("/")} style={{ cursor: 'pointer'}}>
                <img src={logo} width={50} height={50} alt={"/"}/>

            </Wrapper>
    )
}

export default Logo
