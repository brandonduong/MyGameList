import React, { useEffect } from 'react';

import {
  Container, Navbar, NavDropdown, Nav, Col, Row, NavbarBrand, ButtonGroup, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { useHistory } from 'react-router';
import Logo from './Logo';
import Links from './Links';
import { useAuth } from '../context/auth/AuthContext';
import { SearchBar } from './index';
import { GAME_STATUS } from '../constants/gameStatus';

function NavBar() {
  // Get context
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const history = useHistory();

  const onLink = (url) => (event) => {
    event.preventDefault();
    history.push(url);
  };

  function logout() {
    dispatch({
      type: 'logout',
    });
    localStorage.clear();
    history.push('/');
  }

  useEffect(() => {
    console.log('update user state');
  }, [user]);

  return (
    <Navbar variant="dark" className="nav-bar">
      <Container>
        <Logo />
        <NavbarBrand onClick={onLink('/')} style={{ cursor: 'pointer' }}>
          MyGameList
        </NavbarBrand>
        <Links />
        <SearchBar />
        {
            user
            && (
            <NavDropdown variant="dark" title={`${user} `}>
              <NavDropdown.Item onClick={onLink(`/profile/${user}`)}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={onLink('/')}>Settings</NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
            )
          }
      </Container>
    </Navbar>
  );
}

export default NavBar;
