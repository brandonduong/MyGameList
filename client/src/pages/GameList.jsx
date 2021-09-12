import { useHistory, useParams } from 'react-router';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card, Col, Container, Dropdown, Form, ListGroupItem, Row,
} from 'react-bootstrap';
import ShareIcon from '@material-ui/icons/Share';
import { Modal } from '@material-ui/core';
import { useAuth } from '../context/auth/AuthContext';
import { GAME_STATUS } from '../constants/gameStatus';
import { PopUpWindow, ShareButton } from '../components';

function GameList() {
  const { profileUser, listName } = useParams();
  const history = useHistory();

  const {
    state: { user },
  } = useAuth();

  // Deals with displaying existing lists
  const [currentList, setCurrentList] = useState(null);
  const [currentListFound, setCurrentListFound] = useState(false);
  const [columns, setColumns] = useState(null);
  const [statusDropdownHeight, setStatusDropdownHeight] = useState(null);
  const [newCurrentList, setNewCurrentList] = useState(false);
  const [fullThoughts, setFullThoughts] = useState({});

  useEffect(() => {
    if (!currentListFound) {
      fetch(`/api/getList/${profileUser}.${listName}`, {
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
          console.log('refresh');
          data.forEach((item) => {
            // For material ui data grid
            item.id = item._id;
          });
          setCurrentList(data);
        })
        .catch((err) => {
          console.error(err);
          // Bring up 404 page not found
        });
    }
  }, [listName, currentListFound]);

  useEffect(() => {
    // Deals with updating status of a review
    if (newCurrentList) {
      setCurrentListFound(false);
    }
  }, [newCurrentList]);

  useEffect(() => {
    // Deals with updating status of a review
    if (currentListFound) {
      setNewCurrentList(false);
    }
  }, [currentListFound]);

  useEffect(() => {
    if (currentList && !currentListFound) {
      console.log('good:', currentList);
      if (statusDropdownHeight) {
        // Deals with updating status of a review
        setCurrentListFound(true);
      }

      if (40 * currentList.length > 417) {
        setStatusDropdownHeight(417);
      } else if (currentList.length > 0) {
        setStatusDropdownHeight(40 * currentList.length);
      } else {
        setStatusDropdownHeight(40);
      }
    }
  }, [currentList]);

  useEffect(() => {
    if (statusDropdownHeight && !currentListFound) {
      if (profileUser === user) {
        setColumns(ownerColumns);
      } else {
        setColumns(strangerColumns);
      }
    }
  }, [statusDropdownHeight]);

  useEffect(() => {
    if (columns) {
      console.log('good');
      setCurrentListFound(true);
    }
  }, [columns]);

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props; // Fix eslint value is missing in prop-types for JS files
      if (field === 'thoughts') {
        const thoughts = data.value.toString();
        const updatedRows = currentList.map((row) => {
          if (row.id === id) {
            updateReview(id, JSON.stringify({ thoughts, updatedAt: new Date() }));
            return { ...row, thoughts };
          }
          return row;
        });
        setCurrentList(updatedRows);
      } else if (field === 'rating') {
        const rating = data.value;
        const updatedRows = currentList.map((row) => {
          if (row.id === id && rating >= 0 && rating <= 10) {
            updateReview(id, JSON.stringify({ rating, updatedAt: new Date() }));
            return { ...row, rating };
          }
          return row;
        });
        setCurrentList(updatedRows);
      } else if (field === 'hours') {
        let hours = data.value;
        const updatedRows = currentList.map((row) => {
          if (row.id === id && hours >= 0) {
            if (hours > 9999) {
              hours = 9999;
            }
            updateReview(id, JSON.stringify({ hours, updatedAt: new Date() }));
            return { ...row, hours };
          }
          return row;
        });
        setCurrentList(updatedRows);
      }
    },
    [currentList],
  );

  async function updateReview(id, change) {
    console.log(id, change);
    fetch(`/api/updateReview/${id}`, {
      method: 'PUT',
      body: change,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {

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

  function removeReview(id) {
    fetch(`/api/removeReview/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Update row client side
          setNewCurrentList(true);
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

  const ownerColumns = [
    // {field: 'gameId', headerName: 'test', flex: 1},
    {
      field: 'title',
      headerName: 'Title',
      width: 350,
      renderCell: (params) => (
        <strong
          style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
          }}
          onClick={() => { history.push(`/game/${params.row.gameId}`); }}
        >
          {params.value}
        </strong>
      ),
    },
    {
      field: 'rating', headerName: 'Rating', width: 120, editable: true,
    },
    {
      field: 'hours', headerName: 'Hours', width: 115, editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <Dropdown
          drop="right"
          onSelect={((eventKey) => {
            console.log(params, currentList);
            updateReview(params.id, JSON.stringify({ status: eventKey })).then(() => {
              // Update row client side
              setNewCurrentList(true);
            });
          })}
        >
          <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-game-status">
            {params.value}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ height: statusDropdownHeight, overflowY: 'scroll' }}>
            {Object.values(GAME_STATUS).map((status, key) => (
              <Dropdown.Item eventKey={status} key={`status-${key}`}>{status}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
    {
      field: 'thoughts',
      headerName: 'Thoughts',
      width: 255,
      renderCell: (params) => (
        <>
          {' '}
          {params.row.thoughts ? (
            <strong
              style={{
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
              }}
              onClick={() => {
                console.log('View full thoughts');
                setFullThoughts({
                  id: params.row.id,
                  title: params.row.title,
                  thoughts: params.value,
                  editing: true,
                });
              }}
            >
              {params.value}
            </strong>
          )
            : (
              <Button
                onClick={() => setFullThoughts({
                  id: params.row.id,
                  title: params.row.title,
                  thoughts: params.value,
                  editing: true,
                })}
                style={{ width: 450 }}
                className="submit-button"
              >
                Add Thoughts
              </Button>
            )}
        </>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 147,
      renderCell: (params) => (
        <span>
          {(new Date(params.row.updatedAt)).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: 'Delete',
      headerName: ' ',
      disableColumnMenu: true,
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Button onClick={() => { removeReview(params.row.id); }} className="submit-button">Delete</Button>
      ),
    },
  ];

  const strangerColumns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 350,
      renderCell: (params) => (
        <strong
          style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
          }}
          onClick={() => { history.push(`/game/${params.row.gameId}`); }}
        >
          {params.value}
        </strong>
      ),
    },
    {
      field: 'rating', headerName: 'Rating', width: 120,
    },
    {
      field: 'hours', headerName: 'Hours', width: 115,
    },
    {
      field: 'status', headerName: 'Status', width: 130,
    },
    {
      field: 'thoughts',
      headerName: 'Thoughts',
      width: 450,
      renderCell: (params) => (
        <>
          {' '}
          {params.row.thoughts && (
            <strong
              style={{
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
              }}
              onClick={() => {
                console.log('View full thoughts');
                setFullThoughts({
                  id: params.row.id,
                  title: params.row.title,
                  thoughts: params.value,
                  editing: true,
                });
              }}
            >
              {params.value}
            </strong>
          )}
        </>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 147,
      renderCell: (params) => (
        <span>
          {(new Date(params.row.updatedAt)).toLocaleDateString()}
        </span>
      ),
    },
  ];

  function onEditThoughts(event) {
    event.preventDefault();

    // Update backend
    updateReview(fullThoughts.id,
      JSON.stringify({
        thoughts: fullThoughts.thoughts,
        updatedAt: new Date(),
      })).then(() => { // Update row client side
      setNewCurrentList(true);
    });

    // Close modal
    setFullThoughts({});
  }

  return (
    <Container style={{ paddingTop: 25, paddingBottom: 25 }}>

      <Card>
        <Card.Header>

          <Row>
            <Col>
              <ListGroupItem
                style={{ marginTop: 10, marginBottom: 10 }}
                key="BackToLists"
                action
                onClick={() => history.push(`../${profileUser}`)}
              >
                <strong>
                  Back to
                  {' '}
                  {profileUser === user ? 'your lists' : `${profileUser}'s lists`}
                </strong>
              </ListGroupItem>
            </Col>
            <Col
              xs="auto"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <ShareButton alertMessage="MyGameList URL saved to clipboard!" />
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <h1>{listName}</h1>
          <hr />
          {
            currentListFound || newCurrentList
              ? (
                <div style={{ paddingBottom: 15, height: '67vh' }}>
                  <DataGrid
                    rows={currentList}
                    columns={columns}
                    rowHeight={50}
                    pageSize={25}
                    onEditCellChangeCommitted={handleEditCellChangeCommitted}
                    disableSelectionOnClick
                  />
                  {profileUser === user && <small>Double click any cell to edit!</small>}
                </div>
              )
              : <span>Loading...</span>
          }
        </Card.Body>
      </Card>
      <Modal
        open={JSON.stringify(fullThoughts) !== '{}' && fullThoughts.editing}
        onClose={() => setFullThoughts({})}
      >
        <div className="pop-up">
          <h2>{fullThoughts.title}</h2>
          {profileUser === user ? (
            <Form onSubmit={onEditThoughts}>
              <Form.Group>
                <Form.Control
                  placeholder="Thoughts..."
                  as="textarea"
                  rows={3}
                  value={fullThoughts.thoughts}
                  onChange={(event) => {
                    setFullThoughts({ ...fullThoughts, thoughts: event.target.value });
                  }}
                />
              </Form.Group>
              <Button className="submit-button" type="submit">
                Save
              </Button>
            </Form>
          ) : (<span>{fullThoughts.thoughts}</span>)}
        </div>
      </Modal>
    </Container>
  );
}

export default GameList;
