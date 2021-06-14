import React, {useEffect, useState} from "react";
import {Button, Card, Container, Form, Tab, Tabs} from "react-bootstrap";
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
        <Container style={{paddingTop: 25}}>
            <Card style={{width: '50%', left: '25%', padding: 0}}>
                <Card.Body>
                <Form onSubmit={addList}>
                    <Form.Group>
                        <Form.Label>New list name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter list name"
                            className="me-lg-5"
                            onChange={e => setNewListName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="dark">Create New List</Button>
                </Form>
                </Card.Body>
            </Card>
        </Container>

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
        <Tabs id='uncontrolled-tab' transition={false}
              onSelect={tabSelect}>
            {lists.map((list, id) => (
                <Tab key={id} eventKey={list.name} title={list.name}/>
            ))}
            { user === profileUser && listsFound ?
                <Tab key='add-list' eventKey={'add-list'} title={'+'}>
                    {addListForm}
                </Tab>
                :
                <>hey</>

            }
        </Tabs>
    )
}

export default GameListTabs
