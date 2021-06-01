import React, {useEffect, useState} from 'react';
import {Button, Card, Container, Form, Nav} from "react-bootstrap";
import {useHistory, useParams} from "react-router";
import {useAuth} from "../context/auth/AuthContext";

function GameInfo(props) {
    const { gameId } = useParams()
    const [info, setInfo] = useState({
        title: '',
        rating: 0,
        description: '',
        reviews: []
    })

    const history = useHistory()

    useEffect(() => {
        console.log(gameId)
        fetch('/api/game', {
            method: 'POST',
            body: JSON.stringify(gameId),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {

                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    })

    return (
        <Container style={{paddingTop: 25}}>
            <h1>Game Info Page for: {info.title}</h1>
        </Container>
    );
}

export default GameInfo
