import React, { Component } from 'react';
import styled from 'styled-components';

import { useHistory } from 'react-router';
import logo from '../logo.png';

const Wrapper = styled.a.attrs({
  className: 'navbar-brand',
})`margin-left: 10px;
margin-right: 10px;`;

function Logo() {
  const history = useHistory();

  const onLink = (url) => (event) => {
    event.preventDefault();
    history.push(url);
  };

  return (
    <Wrapper onClick={onLink('/')} style={{ cursor: 'pointer' }}>
      <img src={logo} width={45} height={45} alt="/" />

    </Wrapper>
  );
}

export default Logo;
