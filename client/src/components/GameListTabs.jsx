import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row, Tab, Tabs} from "react-bootstrap";
import {Link} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {useAuth} from "../context/auth/AuthContext";
import {useHistory, useParams} from "react-router";

function GameListTabs(props) {
    const {profileUser} = useParams()
    const history = useHistory()

    const {
        state: {user},
    } = useAuth()

    // Deals with adding new lists
    const [newListName, setNewListName] = useState("")

    const [lists, setLists] = useState([])
    const [listsFound, setListsFound] = useState(false)

    useEffect(() => {
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

    function tabSelect(eventKey) {
        if (eventKey === 'add-list') {
            // Add list form
        } else {
            // Link to game list page
            history.push('/profile/' + profileUser + '/' + eventKey)
        }
    }

    const addListForm =
        <Card.Body>
            <Form onSubmit={addList}>
                <Form.Row className={"d-flex"}>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Enter list name"
                            className="me-lg-5"
                            onChange={e => setNewListName(e.target.value)}
                            required
                        />
                    </Col>
                    <Col>
                        <Button type="submit" variant="dark">Create New List</Button>
                    </Col>
                </Form.Row>
            </Form>
        </Card.Body>

    function addList() {
        fetch('/api/addList', {
            method: 'POST',
            body: JSON.stringify({username: profileUser, name: newListName}),
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
                // Bring up 404 page not found
            })
    }

    return (
        <Card>
            {user === profileUser && listsFound ?
                <Card>
                    {addListForm}
                </Card>
                :
                <></>

            }
            {lists.map((list, id) => (
                <Card key={id} style={{padding: 7}}>
                    <Row>
                        <Col>
                        <Card.Link href={profileUser + '/' + list.name}>{list.name}</Card.Link>
                        </Col>
                        <Col xs={'auto'} >
                            <Button style={{ paddingTop: 0, paddingBottom: 0}}>X</Button>
                        </Col>
                    </Row>
                </Card>
            ))}
        </Card>
    )
}

export default GameListTabs
