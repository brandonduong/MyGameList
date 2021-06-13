import React, {useEffect, useState} from "react";
import {Button, Form, Tab, Tabs} from "react-bootstrap";
import {Link} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {useAuth} from "../context/auth/AuthContext";

function GameListTabs(props) {
    const profileUser = props.user

    const {
        state: {user},
    } = useAuth()

    // Deals with displaying existing lists
    const [currentList, setCurrentList] = useState([])
    const [currentListFound, setCurrentListFound] = useState(false)

    // Deals with adding new lists
    const [newListName, setNewListName] = useState("")

    function tabSelect(eventKey) {
        if (eventKey === 'add-list') {
            // Necessary to reduce lag!
            setCurrentListFound(false)
        } else {
            getReviews(eventKey)
        }
    }

    const addListForm =
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

    function getReviews(list) {
        setCurrentListFound(false)
        fetch('/api/getList/' + profileUser + "." + list, {
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
                setCurrentList([...data.data])
                setCurrentListFound(true)
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })
    }

    const columns = [
        // {field: 'gameId', headerName: 'test', flex: 1},
        {
            field: 'title', headerName: 'Title', width: 625, flex: 1,
            renderCell: (params) => (
                <strong style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    <Link to={"/game/" + params.value}>
                        {params.value}
                    </Link>
                </strong>
            )
        },
        {field: 'rating', headerName: 'Rating', width: 450, flex: 0.25},
        {field: 'hours', headerName: 'Hours', width: 450, flex: 0.25},
        {field: 'thoughts', headerName: 'Thoughts', width: 450, flex: 1}
        ]

    return (
        <Tabs id='uncontrolled-tab' transition={false}
              onSelect={tabSelect}>
            {props.lists.map((list, id) => (
                <Tab key={id} eventKey={list.name} title={list.name}>
                    {currentListFound ?
                        <div style={{height: 765, display: 'flex'}}>
                            <div style={{flexGrow: 1}}>
                                <DataGrid columns={columns} rows={currentList} columnBuffer={50}
                                          rowHeight={50}
                                          pageSize={25} autoHeight={true}
                                          getRowId={(row) => row._id}/>
                            </div>
                        </div>
                        :
                        <span>Current list not found.</span>
                    }
                </Tab>
            ))}
            { user === profileUser ?
                <Tab key='add-list' eventKey={'add-list'} title={'+'}>
                    {addListForm}
                </Tab>
                :
                <></>
            }

        </Tabs>
    )
}

export default GameListTabs
