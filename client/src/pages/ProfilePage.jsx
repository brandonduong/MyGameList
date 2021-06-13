import React, {useEffect, useState} from 'react';
import {Button, Container, Form, ListGroupItem, Nav, Tab, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import {Link} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import GameListTabs from "../components/GameListTabs";

function Profile(props) {
    const {user} = useParams()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)

    const [lists, setLists] = useState([])
    const [listsFound, setListsFound] = useState(false)


    useEffect(() => {
        //GET message from server using fetch api
        console.log(user)
        fetch('/api/profile', {
            method: 'POST',
            body: JSON.stringify({user: user}),
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

        fetch('/api/getLists/' + user, {
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

    }, [user])

    return (
        <Container fluid={"sm"}>
            {profileFound && listsFound ?
                <span>
                    User: {user}
                    <br/>
                    Joined: {join_date}
                    <br/>

                    <GameListTabs user={user} lists={lists}/>
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
