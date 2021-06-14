import {useParams} from "react-router";
import {DataGrid} from "@material-ui/data-grid";
import React, {useEffect, useState} from "react";
import {Link} from "@material-ui/core";
import {Container} from "react-bootstrap";

function GameList(props) {
    const {profileUser, listName} = useParams()

    // Deals with displaying existing lists
    const [currentList, setCurrentList] = useState([])
    const [currentListFound, setCurrentListFound] = useState(false)

    useEffect(() => {
        console.log(listName)
        fetch('/api/getList/' + profileUser + "." + listName, {
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
    }, [listName])


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
        <Container fluid={"sm"}>
            {
                currentListFound ?
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
        </Container>
    )
}

export default GameList
