import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../logo.svg'

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})`padding-left: 25px`

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
