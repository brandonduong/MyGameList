import {Card, Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {DataGrid} from "@material-ui/data-grid";

function SearchResults(props) {

    const t = window.location.href.split('q=')
    let query = t[t.length - 1].replaceAll('%20', ' ')

    const [response, setResponse] = useState([])
    const [pageSize, setPageSize] = useState(25)
    const [searchFound, setSearchFound] = useState(false)

    useEffect(() =>
    {
        console.log("fetching")
        setResponse([])
        fetch('/api/search', {
            method: 'POST',
            body: JSON.stringify({query: query}),
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
                // Convert unix time to date
                data.forEach(function (item, index) {
                    // Make date readable
                    item.first_release_date = ((new Date(item.first_release_date * 1000)).toDateString()).split('').splice(4).join('')

                    if (item.first_release_date === "Invalid Date") {
                        item.first_release_date = "No record"
                    }
                })

                setResponse(data)
                setSearchFound(true)

            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })
    }, [query])

    const columns = [
        { field: 'name', headerName: 'Title', width: 800, flex: 1 },
        { field: 'first_release_date', headerName: 'Release Date', width: 450, flex: 1 },
    ]

    return <Container style={{paddingTop: 25}}>
        <Card style={{width: '100%', padding: 0}}>
            <Card.Header>
                <h2>Search results for: {query}</h2>
            </Card.Header>

            <Card.Body>
                {
                    searchFound ?
                        <div style={{ height: 765, width: '100%' }}>
                            <DataGrid rows={response} columns={columns} columnBuffer={50} rowHeight={50} pageSize={pageSize} disableSelectionOnClick />
                        </div>

                        :

                        <span>Loading...</span>
                }

            </Card.Body>
        </Card>

    </Container>
}

export default SearchResults