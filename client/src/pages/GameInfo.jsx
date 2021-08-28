import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {Card} from "@material-ui/core";
import {Rating} from "@material-ui/lab";
import {useAuth} from "../context/auth/AuthContext";
import logo from "../logo.png";

function GameInfo(props) {
    const {gameId} = useParams()
    const [info, setInfo] = useState({
        title: '',
        rating: 0,
        description: '',
        reviews: []
    })
    const [gameFound, setGameFound] = useState(false)
    const [starForAdding, setStarForAdding] = useState(0)
    const [hoursForAdding, setHoursForAdding] = useState("")
    const [listToAddTo, setListToAddTo] = useState("")
    const [lists, setLists] = useState([])
    //const [alreadyReviewed, setAlreadyReviewed] = useState(false)

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
                setInfo({title: data[0].name, cover: data[0].cover.url.replace('t_thumb', 't_cover_big'),
                    first_release_date: new Date(data[0].first_release_date * 1000).toDateString().split('').splice(4).join('')})
                setGameFound(true)
            })
            .catch(err => {
                console.error(err);
            });
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
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })


    }, [gameId])

    function onAddToList(event) {
        event.preventDefault();
        fetch('/api/addToList', {
            method: 'POST',
            body: JSON.stringify({
                list: listToAddTo,
                rating: starForAdding,
                gameId: gameId,
                title: info.title,
                username: user,
                hours: hoursForAdding
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setListToAddTo("")
                    setHoursForAdding("")
                    setStarForAdding(0)
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert(`Review for ${info.title} already exists in ${listToAddTo}`);
            });
    }

    const addToListForm =
        <Form onSubmit={onAddToList}>
            <Form.Row className={"d-flex"}>
                <Col xs="auto">
                    <Card>
                        <Row>
                            <Col>
                                <Form.Label style={{paddingTop: 5, paddingLeft: 5}}>Star Rating:</Form.Label>
                            </Col>
                            <Col>
                                <Rating
                                    style={{paddingTop: 6, paddingRight: 5}}
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
                    <Form.Control as="select" value={listToAddTo} onChange={e => setListToAddTo(e.target.value)}
                                  required>
                        <option>Choose list...</option>
                        {lists.map((list, key) => (
                            <option key={key}>{list.name}</option>
                        ))}
                    </Form.Control>
                </Col>

                <Col xs="auto">
                    <Button type="submit" className={"submit-button"} variant={"dark"}>
                        Add to list
                    </Button>
                </Col>
            </Form.Row>
        </Form>

    return (
        <Container style={{paddingTop: 25}}>
            {gameFound ?
                <span>
                    <h1>{info.title}</h1>
                    <h5>First released <em>{info.first_release_date}</em></h5>
                    <hr/>
                    <img src={info.cover} width={264} height={374}  alt={info.title}/>
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
