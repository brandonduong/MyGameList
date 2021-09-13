import React, { useEffect, useState } from 'react';
import {
  Button, Col, Container, Form, ListGroup, Row,
} from 'react-bootstrap';
import {useHistory, useParams} from 'react-router';
import { Card } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useAuth } from '../context/auth/AuthContext';
import { GAME_STATUS } from '../constants/gameStatus';
import { AGE_RATING } from '../constants/ageRatings';
import { GameReview } from '../components';

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
  const [reviewStatus, setReviewStatus] = useState(0);
  // const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const history = useHistory();

  const {
    state: { user },
  } = useAuth();

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
        const reviews = [];
        const added = [];
        // Only show 1 review per user
        data[0].reviews.sort(compareReviewHelpfulness).forEach((review) => {
          if (!added.includes(review.username)) {
            reviews.push(review);
            added.push(review.username);
          }
        });

        // Parse genres
        const genres = [];
        data[0].genres.forEach((genre) => {
          genres.push(genre.name);
        });

        // Parse involved companies
        const developer = [];
        const publisher = [];
        const supporting = [];
        data[0].involved_companies.forEach((company) => {
          if (company.developer) {
            developer.push(company.company.name);
          }

          if (company.publisher) {
            publisher.push(company.company.name);
          }

          if (company.supporting) {
            supporting.push(company.company.name);
          }
        });

        // Parse platforms
        const platforms = [];
        data[0].platforms.forEach((platform) => {
          platforms.push(`${platform.name} (${platform.abbreviation})`);
        });

        // Parse age ratings
        let ESRB = 'N/A';
        let PEGI = 'N/A';
        data[0].age_ratings.forEach((ageRating) => {
          console.log(ageRating);
          switch (ageRating.category) {
            case 1:
              if (ageRating.rating) {
                ESRB = AGE_RATING[ageRating.rating];
              }
              break;

            case 2:
              if (ageRating.rating) {
                PEGI = AGE_RATING[ageRating.rating];
              }
              break;

            default:
              break;
          }
        });

        setInfo({
          title: data[0].name,
          cover: (data[0].cover ? data[0].cover.url.replace('t_thumb', 't_cover_big') : null),
          first_release_date: new Date(data[0].first_release_date * 1000).toDateString().split('').splice(4)
            .join(''),
          summary: data[0].summary,
          reviews,
          genres,
          developer,
          publisher,
          supporting,
          platforms,
          ESRB,
          PEGI,
          similar_games: data[0].similar_games,
        });
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

  useEffect(() => {
    if (info.title) {
      console.log(info);
      setGameFound(true);
    }
  }, [info]);

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
        status: reviewStatus,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Update ranking live on client side
          setRating(
            Math.round(((((rating * members) + starForAdding)
                    / (members + 1)) + Number.EPSILON) * 100) / 100,
          );
          setMembers(members + 1);
          setCumulativeHours(
            Math.round((((parseInt(cumulativeHours, 10) + parseInt(hoursForAdding, 10))
                    + Number.EPSILON) * 100) / 100),
          );

          // Reset add to list parameters
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
              className="review-field"
              onChange={(e) => {
                if (e.target.value > -1) {
                  if (e.target.value > 9999) {
                    setHoursForAdding(9999);
                  } else {
                    setHoursForAdding(e.target.value);
                  }
                }
              }}
              required
            />
          </Col>

          <Col xs="auto" md="auto">
            <Form.Control
              as="select"
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              required
              className="review-field"
            >
              <option value="">Play Status...</option>
              <option key="game-status-1}">{GAME_STATUS.PLAYING}</option>
              <option key="game-status-2}">{GAME_STATUS.FINISHED}</option>
              <option key="game-status-3}">{GAME_STATUS.COMPLETE}</option>
              <option key="game-status-4}">{GAME_STATUS.ON_HOLD}</option>
              <option key="game-status-5}">{GAME_STATUS.DROPPED}</option>
              <option key="game-status-6}">{GAME_STATUS.PLANNING}</option>
              <option key="game-status-7}">{GAME_STATUS.PLANNING_COPIUM}</option>
            </Form.Control>
          </Col>

          <Col xs="auto" md>
            <Form.Control
              as="select"
              value={listToAddTo}
              onChange={(e) => setListToAddTo(e.target.value)}
              required
              className="review-field"
            >
              <option value="">List...</option>
              {lists.map((list, key) => (
                <option key={`list-${key}`}>{list.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // Make more helpful reviews be shown first
  function compareReviewHelpfulness(a, b) {
    if (a.helpful.length > b.helpful.length) {
      return -1;
    }
    if (a.helpful.length < b.helpful.length) {
      return 1;
    }
    return 0;
  }

  const reviewsList = (
    <div className="scrollable-list">
      {info.reviews.map((review, index) => (
        <GameReview
          key={`review-${index}`}
          index={index}
          username={review.username}
          updatedAt={review.updatedAt}
          hours={review.hours}
          rating={review.rating}
          thoughts={review.thoughts}
          helpful={review.helpful}
          user={user}
          id={review._id}
        />
      ))}
    </div>
  );

  const similarGames = (
    <div className="scrollable-list-horizontal">
      {info.similar_games && info.similar_games.map((game, key) => (
        <img
          key={`similar-${key}`}
          style={{ marginBottom: 15, marginRight: 15, cursor: 'pointer' }}
          src={game.cover.url.replace('t_thumb', 't_cover_small')}
          width={90}
          height={128}
          alt={game.id}
          onClick={() => { history.push(`/game/${game.id}`); }}
        />
      ))}
    </div>
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
                <small>AVG HOURS</small>
              </b>
            </div>
            <div>
              <h3>
                <strong>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {members === 0 ? 0
                    : (members !== 0 && cumulativeHours / members < 999999 ? Math.round(((cumulativeHours / members) + Number.EPSILON) * 100) / 100 : '>999999')}
                </strong>
              </h3>
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
                <small>CUMULATIVE HOURS</small>
              </b>
            </div>
            <div>
              <h3>
                <strong>
                  {members === 0 ? 0
                    : (members !== 0 && cumulativeHours < 999999 ? Math.round(((cumulativeHours / 1) + Number.EPSILON) * 100) / 100 : '>999999')}
                </strong>
              </h3>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  function generalInfoSection(title, infoPoint) {
    return (
      <div style={{
        display: 'flex',
        paddingLeft: 5,
      }}
      >
        <div style={{ paddingRight: 10 }}>
          <b>
            <small>{title}</small>
          </b>
        </div>
        <div>
          <small>{infoPoint}</small>
        </div>
      </div>
    );
  }

  const generalInfo = (
    <Card style={{
      paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 5, marginBottom: 10,
    }}
    >

      <div style={{
        display: 'flex',
        paddingLeft: 5,
      }}
      >
        <div style={{ paddingRight: 10 }}>
          <b>
            INFORMATION:
          </b>
        </div>
      </div>
      <div style={{ paddingLeft: 5, paddingRight: 5 }}>
        <hr style={{ margin: 0 }} />
      </div>
      {generalInfoSection('GENRES:', info.genres && info.genres.join(', '))}
      {generalInfoSection('DEVELOPER:', info.developer && info.developer.join(', '))}
      {generalInfoSection('PUBLISHER:', info.publisher && info.publisher.join(', '))}
      {generalInfoSection('SUPPORTING:', info.supporting && info.supporting.join(', '))}
      {generalInfoSection('PLATFORMS:', info.platforms && info.platforms.join(', '))}
      {generalInfoSection('ESRB RATING:', info.ESRB)}
      {generalInfoSection('PEGI RATING:', info.PEGI)}
    </Card>
  );

  return (
    <Container style={{ paddingTop: 25 }}>
      {gameFound
        ? (
          <span>
            <h1><strong>{info.title}</strong></h1>
            {info.first_release_date !== 'lid Date' && (
              <h5>
                First released
                {' '}
                <em>{info.first_release_date}</em>
              </h5>
            )}
            <hr />

            <Row style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
            >
              <Col style={{ marginBottom: 15, maxWidth: 289 }}>
                {info.cover
                  ? <img src={info.cover} width={264} height={374} alt={info.title} />
                  : <h3><strong>No Cover Found</strong></h3>}

                <hr />
                {generalInfo}
              </Col>
              <Col>
                {rankingInfo}
                {user && addToListForm}
                <h3><strong>Synopsis</strong></h3>
                <hr style={{ marginTop: 0 }} />
                <h5>
                  {info.summary}
                </h5>

                <h3><strong>Reviews</strong></h3>
                <hr style={{ marginTop: 0 }} />
                {reviewsList}

                <h3><strong>Similar Games</strong></h3>
                <hr style={{ marginTop: 0 }} />
                {similarGames}
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
