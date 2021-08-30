import React, { useEffect, useState } from 'react';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import { Card } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useAuth } from '../context/auth/AuthContext';

function GameInfo() {
  const { gameId } = useParams();
  const [info, setInfo] = useState({
    title: '',
    rating: 0,
    description: '',
    reviews: [],
  });
  const [gameFound, setGameFound] = useState(false);
  const [starForAdding, setStarForAdding] = useState(0);
  const [hoursForAdding, setHoursForAdding] = useState('');
  const [listToAddTo, setListToAddTo] = useState('');
  const [lists, setLists] = useState([]);
  const [rating, setRating] = useState(0);
  const [members, setMembers] = useState(0);
  const [cumulativeHours, setCumulativeHours] = useState(0);
  // const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  const {
    state: { user },
  } = useAuth();

  const onChange = (e) => setHoursForAdding(e.target.value);

  useEffect(() => {
    console.log(gameId);
    fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        const error = new Error(res.error);
        throw error;
      })
      .then((data) => {
        setInfo({
          title: data[0].name,
          cover: data[0].cover.url.replace('t_thumb', 't_cover_big'),
          first_release_date: new Date(data[0].first_release_date * 1000).toDateString().split('').splice(4)
            .join(''),
          summary: data[0].summary,
        });
        setGameFound(true);
      })
      .catch((err) => {
        console.error(err);
      });
    fetch(`/api/gameRanking/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        const error = new Error(res.error);
        throw error;
      })
      .then((data) => {
        if (data.game) {
          setRating(data.game.rating);
          setMembers(data.game.members);
          setCumulativeHours(data.game.cumulativeHours);
        }
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
    fetch(`/api/getLists/${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        const error = new Error(res.error);
        throw error;
      })
      .then((data) => {
        console.log(data);
        setLists([...data.data]);
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
  }, [gameId]);

  function onAddToList(event) {
    event.preventDefault();
    fetch('/api/addToList', {
      method: 'POST',
      body: JSON.stringify({
        list: listToAddTo,
        rating: starForAdding,
        gameId,
        title: info.title,
        username: user,
        hours: hoursForAdding,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setListToAddTo('');
          setHoursForAdding('');
          setStarForAdding(0);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Review for ${info.title} already exists in ${listToAddTo}`);
      });
  }

  const addToListForm = (
    <Card style={{ padding: 10, marginBottom: 10 }}>
      <Form onSubmit={onAddToList}>
        <Row style={{ paddingLeft: 5, paddingRight: 5 }}>
          <Col xs="auto">
            <Button type="submit" className="submit-button" variant="dark">
              Add to list
            </Button>
          </Col>
          <Col xs="auto" md="auto">
            <Card>
              <Rating
                style={{ paddingTop: 6 }}
                name="starsForAdding"
                defaultValue={0}
                max={10}
                onChange={(event, newValue) => {
                  setStarForAdding(newValue);
                }}
                value={starForAdding}
              />
            </Card>
          </Col>

          <Col xs="auto" md="auto">
            <Form.Control
              type="number"
              name="hours"
              placeholder="Hours"
              value={hoursForAdding}
              onChange={onChange}
              required
            />
          </Col>

          <Col xs="auto" md>
            <Form.Control
              as="select"
              value={listToAddTo}
              onChange={(e) => setListToAddTo(e.target.value)}
              required
            >
              <option value="">Choose list...</option>
              {lists.map((list, key) => (
                <option key={`list-${key}`}>{list.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  const rankingInfo = (
    <Card style={{
      paddingLeft: 10, paddingTop: 10, paddingBottom: 5, marginBottom: 10,
    }}
    >
      <Row>
        <Col xs="auto">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 5,
          }}
          >
            <div style={{ paddingBottom: 5, paddingRight: 10 }}>
              <b>
                <small>SCORE</small>
              </b>
            </div>
            <div>
              <h3><strong>{rating}</strong></h3>
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <div style={{ paddingBottom: 5, paddingRight: 10 }}>
              <b>
                <small>MEMBERS</small>
              </b>
            </div>
            <div>
              <h3><strong>{members}</strong></h3>
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <div style={{ paddingBottom: 5, paddingRight: 10 }}>
              <b>
                <small>HOURS</small>
              </b>
            </div>
            <div>
              <h3><strong>{cumulativeHours < 999999 ? cumulativeHours : '>999999'}</strong></h3>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Container lg="auto" style={{ paddingTop: 25 }}>
      {gameFound
        ? (
          <span>
            <h1><strong>{info.title}</strong></h1>
            <h5>
              First released
              {' '}
              <em>{info.first_release_date}</em>
            </h5>
            <hr />

            <Row>
              <Col xs="auto">
                <img src={info.cover} width={264} height={374} alt={info.title} />
              </Col>
              <Col>
                {rankingInfo}
                {addToListForm}
                <h3><strong>Synopsis</strong></h3>
                <hr />
                <h5>
                  {info.summary}
                </h5>
              </Col>
            </Row>
          </span>
        )

        : (
          <span>
            Loading...
          </span>
        )}
    </Container>
  );
}

export default GameInfo;
