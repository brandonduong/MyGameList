import React, {useEffect, useState} from 'react';
import {Card, Container, Tab, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import {GameListTabs} from "../components/index"
import UserProfileInfo from "../components/UserProfileInfo";

function Profile(props) {
    const [key, setKey] = useState('gameLists');

    return (
        <Container fluid={"sm"} style={{paddingTop: 25}}>
            <UserProfileInfo/>

            <Container style={{paddingTop: 25, paddingBottom: 25, backgroundColor: 'white', borderRadius: 25}}>
            <Tabs className={'general-tab'} fill id='uncontrolled-tab' transition={false} activeKey={key}
                  onSelect={(k) => setKey(k)}>
                <Tab eventKey={'gameLists'} title={'Game Lists'} tabClassName={'inactive-tab'}>
                    <GameListTabs/>
                </Tab>
                <Tab eventKey={'statistics'} title={'Statistics'} tabClassName={'inactive-tab'}>
                    Stats soon!
                </Tab>
            </Tabs>
            </Container>
        </Container>
    )
}

export default Profile
