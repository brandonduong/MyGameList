import React, { useEffect, useState } from 'react';
import {
  Button, Card, Col, Form, ListGroupItem, Row,
} from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { useAuth } from '../context/auth/AuthContext';

function GameListTabs(props) {
  const { profileUser } = useParams();
  const history = useHistory();

  const {
    state: { user },
  } = useAuth();

  // Deals with adding new lists
  const [newListName, setNewListName] = useState('');

  const [lists, setLists] = useState([]);
  const [listsFound, setListsFound] = useState(true);

  useEffect(() => {
    fetch(`/api/getLists/${profileUser}`, {
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
  }, [profileUser, listsFound]);

  const addListForm = (
    <Card.Body>
      <Form onSubmit={addList}>
        <Row>
          <Col xs="auto" md>
            <Form.Control
              type="text"
              placeholder="Enter list name"
              value={newListName}
              className="me-lg-5"
              onChange={(e) => {
                if (e.target.value.length <= 20) { setNewListName(e.target.value.trim()); }
              }}
              required
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" className="submit-button">Create New List</Button>
          </Col>
        </Row>
      </Form>
    </Card.Body>
  );

  function addList(event) {
    event.preventDefault();

    // Clear input box
    setNewListName('');

    fetch('/api/addList', {
      method: 'POST',
      body: JSON.stringify({ username: profileUser, name: newListName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setListsFound(!listsFound);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
  }

  function deleteList(listName) {
    fetch(`/api/removeList/${listName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setListsFound(!listsFound);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
  }

  function linkToList(listName) {
    history.push(listName);
  }

  return (
    <Card>
      {user === profileUser && (
        <Card>
          {addListForm}
        </Card>
      )}
      <div id="lists">
        {lists.map((list, id) => (
          <Card id={id} key={id} style={{ padding: 0 }}>
            <Row>
              <Col style={{ paddingLeft: 28 }}>
                <ListGroupItem
                  action
                  onClick={() => linkToList(`${profileUser}/${list.name}`)}
                  style={{ border: 'none', padding: 0, paddingTop: 10 }}
                >
                  <h3><strong>{list.name}</strong></h3>
                </ListGroupItem>
              </Col>
              {user === profileUser && (
                <Col xs="auto" style={{ marginRight: 15 }}>
                  <Button className="submit-button" onClick={() => deleteList(list.name)} style={{ paddingTop: 8 }}>
                    <h3>
                      <span style={{ color: 'white' }}>X</span>
                    </h3>
                  </Button>
                </Col>
              )}
            </Row>
          </Card>
        ))}
      </div>
    </Card>
  );
}

export default GameListTabs;
