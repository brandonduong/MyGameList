import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {useParams} from "react-router";

function Profile(props) {
    const { user } = useParams()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)


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
    })

    return (
        <Container fluid={"sm"}>
            {profileFound ?
                <span>
                    User: {user}
                        <br/>
                    Joined: {join_date}
                </span>

                :

                <span>
                    Profile not found.
                </span>
            }
        </Container>
    );
}

export default Profile
