import React, {useEffect, useState} from 'react';
import {Container, ListGroupItem} from "react-bootstrap";
import {useParams} from "react-router";
import {Card, Link} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";

function Profile(props) {
    const { user } = useParams()

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

        fetch('/api/getList/' + user, {
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

    const columns = [
        // {field: 'gameId', headerName: 'test', flex: 1},
        { field: 'title', headerName: 'Title', width: 625, flex: 1,
            renderCell: (params) => (
                <strong>
                    <Link to={"/game/" + params.value}>
                        {params.value}
                    </Link>
                </strong>
            )},
        { field: 'rating', headerName: 'Rating', width: 450, flex: 0.25 },
        { field: 'hours', headerName: 'Hours', width: 450, flex: 0.25 },
        { field: 'thoughts', headerName: 'Thoughts', width: 450, flex: 1 }
    ]

    return (
        <Container fluid={"sm"}>
            {profileFound && listsFound ?
                <span>
                    User: {user}
                        <br/>
                    Joined: {join_date}
                    <br/>

                    <div style={{ height: 765, width: '100%' }}>
                        <DataGrid columns={columns} rows={lists} columnBuffer={50} rowHeight={50} pageSize={25}
                                  getRowId={(row) => row._id}/>
                    </div>
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
