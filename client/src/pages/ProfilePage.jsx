import React, {useEffect, useState} from 'react';
import {Container, ListGroupItem, Nav, Tab, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import {Card, Link} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";

function Profile(props) {
    const {user} = useParams()

    const [join_date, setJoinDate] = useState("")
    const [profileFound, setProfileFound] = useState(false)

    const [lists, setLists] = useState([])
    const [listsFound, setListsFound] = useState(false)

    const [currentList, setCurrentList] = useState([])
    const [currentListFound, setCurrentListFound] = useState(false)

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

        // Initialize default list
        getReviews('Default')

    }, [user])

    function tabSelect(eventKey) {
        if (eventKey === 'add-list') {
            addList()
        } else {
            getReviews(eventKey)
        }
    }

    function addList() {
        return
    }

    function getReviews(list) {
        setCurrentListFound(false)
        fetch('/api/getList/' + user + "." + list, {
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
                <strong>
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
        <Container fluid={"sm"} >
            {profileFound && listsFound ?
                <span>
                    User: {user}
                    <br/>
                    Joined: {join_date}
                    <br/>

                    <Tabs id='uncontrolled-tab' defaultActiveKey={'Default'} transition={false}
                          onSelect={getReviews} >
                        {lists.map((list, id) => (
                            <Tab key={id} eventKey={list.name} title={list.name}>
                                {currentListFound ?
                                    <div style={{height: 765, display: 'flex'}}>
                                        <div style={{ flexGrow: 1 }}>
                                        <DataGrid columns={columns} rows={currentList} columnBuffer={50} rowHeight={50}
                                                  pageSize={25} autoHeight={true}
                                                  getRowId={(row) => row._id}/>
                                        </div>
                                    </div>
                                    :
                                    <span>Current list not found.</span>
                                }
                            </Tab>
                        ))}
                        <Tab key='add-list' eventKey={'add-list'} title={'+'}/>

                    </Tabs>
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
