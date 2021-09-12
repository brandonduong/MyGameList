import { Col, Row } from 'react-bootstrap';
import { Rating } from '@material-ui/lab';
import { Card } from '@material-ui/core';
import React, { useState } from 'react';

function GameReview(props) {
  const [readMore, setReadMore] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(props.helpful.length);
  const [helpful, setHelpful] = useState(props.helpful.includes(props.user));

  function helpfulReview(like) {
    fetch('/api/helpfulReview', {
      method: 'PUT',
      body: JSON.stringify({
        id: props.id,
        helpful: like,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Changed number of helpfuls on review', props.id);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Card
      style={{
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 10,
        paddingRight: 10,
        marginBottom: 10,
      }}
    >
      <Row>
        <Col>
          <h3>{props.username}</h3>
          <em>
            {helpfulCount}
            {' '}
            people found this review helpful
          </em>
        </Col>
        <Col style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
        >
          <h5>{(new Date(props.updatedAt)).toLocaleDateString()}</h5>
          <em>
            {Math.round(((props.hours) + Number.EPSILON) * 100) / 100}
            {' '}
            hours played
          </em>
          <Rating
            style={{ paddingTop: 6 }}
            max={10}
            value={props.rating}
            readOnly
            precision={0.5}
          />
        </Col>
      </Row>
      <hr />
      <span style={{ overflowWrap: 'break-word' }}>
        {readMore || props.thoughts.length < 300 ? (
          <span>
            {props.thoughts}
            <br />
            <br />

            {helpful ? (
              <span style={{ overflowWrap: 'break-word' }}>
                Thanks for your feedback!
                {' '}
                <span style={{ fontWeight: 'bold' }}>You found this review helpful.</span>
                {' '}
                <strong
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    console.log('Helpful - 1', props.user);
                    setHelpfulCount(helpfulCount - 1);
                    setHelpful(!helpful);
                    helpfulReview(false);
                  }}
                >
                  Undo
                </strong>
              </span>
            ) : (
              <span style={{ overflowWrap: 'break-word' }}>
                I found this review
                {' '}
                <strong
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    console.log('Helpful + 1', props.user);
                    setHelpfulCount(helpfulCount + 1);
                    setHelpful(!helpful);
                    helpfulReview(true);
                  }}
                >
                  Helpful
                </strong>
              </span>
            )}
          </span>
        ) : (`${props.thoughts.slice(0, 300)}...`)}
      </span>
      <br />

      {props.thoughts.length > 300
      && (
        <span style={{ overflowWrap: 'break-word', cursor: 'pointer' }} onClick={() => { setReadMore(!readMore); }}>
          <strong>
            {readMore ? 'show less' : 'read more'}
          </strong>
        </span>
      )}
    </Card>
  );
}

export default GameReview;
