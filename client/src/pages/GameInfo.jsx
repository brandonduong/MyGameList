import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {useParams} from "react-router";

function GameInfo(props) {
    const { gameId } = useParams()
    const [info, setInfo] = useState({
        title: '',
        rating: 0,
        description: '',
        reviews: []
    })
    const [gameFound, setGameFound] = useState(false)

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
                setInfo({title: data[0].name})
                setGameFound(true)
            })
            .catch(err => {
                console.error(err);
            });
    }, [gameId])

    return (
        <Container style={{paddingTop: 25}}>
            {gameFound ?
                <span>
                    <h1>Game Info Page for: {info.title}</h1>
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
