import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {Box, Card, Typography} from "@material-ui/core";
import {Rating} from "@material-ui/lab";
import {useAuth} from "../context/auth/AuthContext";

function GameInfo(props) {
    const { gameId } = useParams()
    const [info, setInfo] = useState({
        title: '',
        rating: 0,
        description: '',
        reviews: []
    })
    const [gameFound, setGameFound] = useState(false)
    const [starForAdding, setStarForAdding] = useState(0)
    const [hoursForAdding, setHoursForAdding] = useState("")
    const [alreadyReviewed, setAlreadyReviewed] = useState(false)

    const {
        state: {user},
    } = useAuth()

    const onChange = e => setHoursForAdding(e.target.value)

    useEffect(() => {
        console.log(gameId)
        fetch('/api/game', {
            method: 'POST',
            body: JSON.stringify({gameId: gameId}),
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
                setInfo({title: data[0].name})
                setGameFound(true)
            })
            .catch(err => {
                console.error(err);
            });
    }, [gameId])

    function onAddToList(event) {
        event.preventDefault();
        fetch('/api/addToList', {
            method: 'POST',
            body: JSON.stringify({rating: starForAdding, gameId: gameId, username: user}),
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
                alert('Error creating review.');
            });
    }

    const addToListForm =
        <Form onSubmit={onAddToList}>
            <Form.Row className={"d-flex"}>
                <Col xs="auto">
                    <Card>
                        <Row>
                            <Col>
                                <Form.Label style={{paddingTop: 5}}>Star Rating:</Form.Label>
                            </Col>
                            <Col>
                                <Rating
                                    style={{marginTop: 5}}
                                    name="starsForAdding"
                                    defaultValue={0}
                                    max={10}
                                    onChange={(event, newValue) => {
                                        setStarForAdding(newValue)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs="2">
                    <Form.Control
                        type="number"
                        name="hours"
                        placeholder="Enter hours"
                        value={hoursForAdding}
                        onChange={onChange}
                        required/>
                </Col>
                <Col xs="auto">
                    <Button type="submit" variant={"dark"}>
                        Add to list
                    </Button>
                </Col>
            </Form.Row>
        </Form>

    return (
        <Container style={{paddingTop: 25}}>
            {gameFound ?
                <span>
                    <h1>Game Info Page for: {info.title}</h1>
                    {addToListForm}
                </span>

                :

                <span>
                    Loading...
                </span>
            }
        </Container>
    );
}

export default GameInfo
