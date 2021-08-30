import React, { useState } from 'react';
import {
  Col,
  Container, Row, Tab, Tabs,
} from 'react-bootstrap';
import { GameListTabs } from '../components/index';
import UserProfileInfo from '../components/UserProfileInfo';

function Profile() {
  const [key, setKey] = useState('gameLists');

  return (
    <Container style={{ paddingTop: 25 }}>
      <UserProfileInfo />

      <Container style={{
        paddingTop: 25, paddingBottom: 25, backgroundColor: 'white', borderRadius: 25,
      }}
      >
        <Tabs
          className="general-tab"
          fill
          id="uncontrolled-tab"
          transition={false}
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="gameLists" title="Game Lists" tabClassName="inactive-tab">
            <GameListTabs />
          </Tab>
          <Tab eventKey="statistics" title="Statistics" tabClassName="inactive-tab">
            Stats soon!
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
}

export default Profile;
