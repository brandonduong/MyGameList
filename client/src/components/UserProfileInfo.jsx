import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, ListGroupItem, Row} from "react-bootstrap";
import {useAuth} from "../context/auth/AuthContext";
import {useHistory, useParams} from "react-router";
import {Spa} from "@material-ui/icons";

function UserProfileInfo(props) {
    const {profileUser} = useParams()

    const {
        state: {user},
    } = useAuth()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)

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
        <Container>
            {profileFound ?
                <span>
                    <h1>{profileUser}</h1>
                    Joined: {join_date}
                    <hr/>
                </span>
                :
                <span>
                    Profile not found.
                </span>
            }
        </Container>
    )
}

export default UserProfileInfo
