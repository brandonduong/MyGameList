import React, { useEffect, useState } from 'react';
import {
  Container,
} from 'react-bootstrap';
import { useParams } from 'react-router';

function UserProfileInfo() {
  const { profileUser } = useParams();

  const [joinDate, setJoinDate] = useState('');
  const [profileFound, setProfileFound] = useState(false);

  useEffect(() => {
    // GET message from server using fetch api
    console.log(profileUser);
    fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({ user: profileUser }),
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
        setJoinDate(data.join_date);
        setProfileFound(true);
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
  }, [profileUser]);

  return (
    <Container>
      {profileFound
        ? (
          <span>
            <h1>{profileUser}</h1>
            <h5>
              Member since
              {' '}
              <em>{joinDate}</em>
            </h5>
            <hr />
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

export default UserProfileInfo;
