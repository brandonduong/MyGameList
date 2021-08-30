import { useHistory, useParams } from 'react-router';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import { Card, Container, ListGroupItem } from 'react-bootstrap';
import LinkIcon from '@material-ui/icons/Link';
import { Link } from '@material-ui/core';
import { useAuth } from '../context/auth/AuthContext';

function GameList() {
  const { profileUser, listName } = useParams();
  const history = useHistory();

  const {
    state: { user },
  } = useAuth();

  // Deals with displaying existing lists
  const [currentList, setCurrentList] = useState([]);
  const [currentListFound, setCurrentListFound] = useState(false);
  const [columns, setColumns] = useState([]);
  const [gameIds, setGameIds] = useState([]);

  useEffect(() => {
    console.log(listName);
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
        console.log(data);
        const ids = {};
        data.data.forEach((item, index) => {
          // For material ui data grid
          item.id = item._id;
          ids[`${item.title}`] = item.gameId;
        });
        setGameIds(ids);

        setCurrentList([...data.data]);
        setCurrentListFound(true);
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
    if (profileUser === user) {
      setColumns(ownerColumns);
    } else {
      setColumns(strangerColumns);
    }
  }, [listName]);

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props; // Fix eslint value is missing in prop-types for JS files
      if (field === 'thoughts') {
        const thoughts = data.value.toString();
        const updatedRows = currentList.map((row) => {
          if (row.id === id) {
            updateReview(id, JSON.stringify({ thoughts }));
            return { ...row, thoughts };
          }
          return row;
        });
        setCurrentList(updatedRows);
      } else if (field === 'rating') {
        const rating = data.value;
        const updatedRows = currentList.map((row) => {
          if (row.id === id && rating >= 0 && rating <= 10) {
            updateReview(id, JSON.stringify({ rating }));
            return { ...row, rating };
          }
          return row;
        });
        setCurrentList(updatedRows);
      } else if (field === 'hours') {
        const hours = data.value;
        const updatedRows = currentList.map((row) => {
          if (row.id === id && hours >= 0) {
            updateReview(id, JSON.stringify({ hours }));
            return { ...row, hours };
          }
          return row;
        });
        setCurrentList(updatedRows);
      }
    },
    [currentList],
  );

  function updateReview(id, change) {
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

  async function getGameId(title, callback) {
    await fetch(`/api/getList/${profileUser}.${listName}`, {
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
        const ids = {};
        data.data.forEach((item, index) => {
          ids[`${item.title}`] = item.gameId;
        });

        let goodId = 1;

        console.log(ids);

        goodId = ids[title];

        callback(goodId);
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
          onClick={() => getGameId(params.value, (gameId) => { history.push(`/game/${gameId}`); })}
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
      field: 'thoughts', headerName: 'Thoughts', width: 450, editable: true,
    },
  ];

  const strangerColumns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 350,
      renderCell: (params) => (
        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      field: 'thoughts', headerName: 'Thoughts', width: 450,
    },
  ];

  return (
    <Container style={{ paddingTop: 25 }}>

      <Card>
        <Card.Header>
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
        </Card.Header>

        <Card.Body>
          <h1>{listName}</h1>
          <hr />
          {
            currentListFound
              ? (
                <div style={{ paddingTop: 25 }}>
                  <div>
                    <DataGrid
                      columns={columns}
                      rows={currentList}
                      rowHeight={50}
                      pageSize={25}
                      autoHeight
                      getRowId={(row) => row.id}
                      onEditCellChangeCommitted={handleEditCellChangeCommitted}
                      disableSelectionOnClick
                    />
                  </div>
                </div>
              )
              : <span>Loading...</span>
          }
          {profileUser === user && <small>Double click any cell to edit!</small>}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default GameList;
