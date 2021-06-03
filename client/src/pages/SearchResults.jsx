import {Card, Container, ListGroup} from "react-bootstrap";
import React, {useEffect, useState} from "react";

function SearchResults(props) {
    const t = window.location.href.split('q=')
    let query = t[t.length - 1].replaceAll('%20', ' ')

    const [response, setResponse] = useState([])

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
                setResponse(data)
            })
            .catch(err => {
                console.error(err);
                // Bring up 404 page not found
            })
    }, [query])

    return <Container style={{paddingTop: 25}}>
        <Card style={{width: '50%', left: '25%', padding: 0}}>
            <Card.Header>
                <h2>Search results for: {query}</h2>
            </Card.Header>

            <Card.Body>
                Results:
                <ListGroup>
                    {response.map((item, key) => <ListGroup.Item
                        key={'sq-' + key}
                    >
                        {item.name} <br />
                        <small>by <em>{item.slug}</em></small>
                    </ListGroup.Item>)}
                    {response.length === 0 ? <p>Loading...</p> : <></>}
                </ListGroup>
            </Card.Body>
        </Card>
    </Container>
}

export default SearchResults
