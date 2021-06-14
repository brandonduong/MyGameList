import React, {useEffect, useState} from 'react';
import {Container, Tab, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import {GameListTabs} from "../components/index"

function Profile(props) {
    const {profileUser} = useParams()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)

    const [key, setKey] = useState('gameLists');


    useEffect(() => {
        //GET message from server using fetch api
        console.log(profileUser)
        fetch('/api/profile', {
            method: 'POST',
            body: JSON.stringify({user: profileUser}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()

                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .then(data => {
                console.log(data)
                setJoinDate(data.join_date)
                setProfileFound(true)
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })
    }, [profileUser])

    return (
        <Container fluid={"sm"}>
            {profileFound ?
                <span>
                    User: {profileUser}
                    <br/>
                    Joined: {join_date}
                    <br/>

                    <Tabs id='uncontrolled-tab' transition={false} activeKey={key}
                          onSelect={(k) => setKey(k)}>
                        <Tab eventKey={'gameLists'} title={'Game Lists'}>
                            <GameListTabs/>
                        </Tab>
                        <Tab eventKey={'statistics'} title={'Statistics'}>
                            Stats soon!
                        </Tab>
                    </Tabs>
                </span>

                :

                <span>
                    Profile not found.
                </span>
            }
        </Container>
    )
}

export default Profile
