import { useHistory, useParams } from 'react-router';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card, Container, Dropdown, ListGroupItem,
} from 'react-bootstrap';
import { useAuth } from '../context/auth/AuthContext';
import { GAME_STATUS } from '../constants/gameStatus';

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

  useEffect(() => {
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
  }, [listName]);

  useEffect(() => {
    if (currentList) {
      console.log('good:', currentList);
      if (40 * currentList.length > 417) {
        setStatusDropdownHeight(417);
      } else if (currentList.length > 0){
        setStatusDropdownHeight(40 * currentList.length);
      } else {
        setStatusDropdownHeight(40);
      }
    }
  }, [currentList]);

  useEffect(() => {
    if (statusDropdownHeight) {
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
        let hours = data.value;
        const updatedRows = currentList.map((row) => {
          if (row.id === id && hours >= 0) {
            if (hours > 9999) {
              hours = 9999;
            }
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
            updateReview(params.id, JSON.stringify({ status: eventKey }));

            // Update row client side
            const updatedRows = currentList.map((row) => {
              if (row.id === params.id) {
                return { ...row, status: eventKey};
              }
              return row;
            });
            setCurrentList(updatedRows);
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
      field: 'thoughts', headerName: 'Thoughts', width: 450, editable: true,
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
      field: 'thoughts', headerName: 'Thoughts', width: 450,
    },
  ];

  return (
    <Container style={{ paddingTop: 25, paddingBottom: 25 }}>

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
                  <DataGrid
                    rows={currentList}
                    columns={columns}
                    columnBuffer={50}
                    rowHeight={50}
                    pageSize={25}
                    autoHeight
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
    </Container>
  );
}

export default GameList;
