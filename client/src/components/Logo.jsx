import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../logo.svg'

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})`margin-left: -5px;
margin-right: 0`

class Logo extends Component {
    render() {
        return (
            <Wrapper href="/">
                <img src={logo} width={50} height={50} alt={"/"}/>

            </Wrapper>
        );
    }
}

export default Logo
