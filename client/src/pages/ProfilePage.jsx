import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {useParams} from "react-router";
import {GameListTabs} from "../components/index"

function Profile(props) {
    const {profileUser} = useParams()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)

    const [lists, setLists] = useState([])
    const [listsFound, setListsFound] = useState(false)


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

        fetch('/api/getLists/' + profileUser, {
            method: 'GET',
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
                setLists([...data.data])
                setListsFound(true)
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })

    }, [profileUser])

    return (
        <Container fluid={"sm"}>
            {profileFound && listsFound ?
                <span>
                    User: {profileUser}
                    <br/>
                    Joined: {join_date}
                    <br/>

                    <GameListTabs user={profileUser} lists={lists} listsFound={listsFound}/>
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
