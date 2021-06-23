import React, {useEffect, useState} from 'react';
import {Card, Container, Tab, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import {GameListTabs} from "../components/index"
import UserProfileInfo from "../components/UserProfileInfo";

function Profile(props) {
    const {profileUser} = useParams()

    const [key, setKey] = useState('gameLists');

    return (
        <Container fluid={"sm"} style={{paddingTop: 25}}>
            <UserProfileInfo/>

            <Tabs id='uncontrolled-tab' transition={false} activeKey={key}
                  onSelect={(k) => setKey(k)}>
                <Tab eventKey={'gameLists'} title={'Game Lists'}>
                    <GameListTabs/>
                </Tab>
                <Tab eventKey={'statistics'} title={'Statistics'}>
                    Stats soon!
                </Tab>
            </Tabs>
        </Container>
    )
}

export default Profile
