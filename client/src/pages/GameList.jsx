import {useParams} from "react-router";
import {DataGrid} from "@material-ui/data-grid";
import React, {useEffect, useState} from "react";
import {Link} from "@material-ui/core";
import {Container} from "react-bootstrap";
import {forEach} from "react-bootstrap/ElementChildren";

function GameList(props) {
    const {profileUser, listName} = useParams()

    // Deals with displaying existing lists
    const [currentList, setCurrentList] = useState([])
    const [currentListFound, setCurrentListFound] = useState(false)
    const [editReviewSuccess, setEditReviewSuccess] = useState(true)

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
                data.data.forEach(function (item, index) {
                    // For material ui data grid
                    item.id = item._id
                })

                setCurrentList([...data.data])
                setCurrentListFound(true)
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })
    }, [listName])

    const handleEditCellChangeCommitted = React.useCallback(
        ({ id, field, props }) => {
            const data = props; // Fix eslint value is missing in prop-types for JS files
            if (field === 'thoughts') {
                const thoughts = data.value.toString();
                const updatedRows = currentList.map((row) => {

                    if (row.id === id) {
                        updateReview(id, JSON.stringify({thoughts}))
                        return { ...row, thoughts };
                    }
                    return row;
                });
                setCurrentList(updatedRows);
            }
            else if (field === 'rating') {
                const rating = data.value.toString();
                const updatedRows = currentList.map((row) => {

                    if (row.id === id) {
                        updateReview(id, JSON.stringify({rating}))
                        return { ...row, rating };
                    }
                    return row;
                });
                setCurrentList(updatedRows);
            }
        },
        [currentList],
    );

    function updateReview(id, change) {
        console.log(id, change)
        fetch('/api/updateReview/' + id, {
            method: 'PUT',
            body: change,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setEditReviewSuccess(true)
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                setEditReviewSuccess(false)
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
        {field: 'rating', headerName: 'Rating', width: 450, flex: 0.25, editable: true},
        {field: 'hours', headerName: 'Hours', width: 450, flex: 0.25, editable: true},
        {field: 'thoughts', headerName: 'Thoughts', width: 450, flex: 1, editable: true}
    ]

    return (
        <Container fluid={"sm"} style={{paddingTop: 25}}>
            {
                currentListFound ?
                    <div style={{height: 765, display: 'flex'}}>
                        <div style={{flexGrow: 1}}>
                            <DataGrid columns={columns} rows={currentList}
                                      rowHeight={50}
                                      pageSize={25} autoHeight={true}
                                      getRowId={(row) => row.id}
                                      onEditCellChangeCommitted={handleEditCellChangeCommitted}
                            />
                        </div>
                    </div>
                    :
                    <span>Current list not found.</span>
            }
        </Container>
    )
}

export default GameList
