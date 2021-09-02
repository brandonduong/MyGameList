import { Card, Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router';

function SearchResults() {
  const t = window.location.href.split('q=');
  const query = t[t.length - 1].replaceAll('%20', ' ');
  const history = useHistory();

  const [response, setResponse] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [searchFound, setSearchFound] = useState(false);

  useEffect(() => {
    console.log('fetching');
    fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
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
        // Convert unix time to date
        data.forEach((item) => {
          // Make date readable
          item.first_release_date = ((new Date(item.first_release_date * 1000)).toDateString())
            .split('').splice(4)
            .join('');
          if (item.first_release_date === 'lid Date') {
            item.first_release_date = 'No record';
          }
        });
        setResponse(data);
      })
      .catch((err) => {
        console.error(err);
        // Bring up 404 page not found
      });
  }, [query]);

  useEffect(() => {
    if (response.length > 0) {
      console.log('good:', response);
      setSearchFound(true);
    }
  }, [response]);

  const columns = [
    // {field: 'title', headerName: 'test', flex: 1},
    {
      field: 'name',
      headerName: 'Title',
      width: 625,
      renderCell: (params) => (
        <strong
          style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
          }}
          onClick={() => { history.push(`/game/${params.row.id}`); }}
        >
          {params.value}
        </strong>
      ),
    },
    {
      field: 'first_release_date', headerName: 'Release Date', width: 450, flex: 1,
    },
  ];

  return (
    <Container style={{ paddingTop: 25, paddingBottom: 25 }}>
      <Card style={{ width: '100%', padding: 0 }}>
        <Card.Header>
          <h1>
            <strong>
              Search results for:
            </strong>
            {' '}
            <small>
              {query}
            </small>
          </h1>
        </Card.Header>

        <Card.Body>
          {
            searchFound
              ? (
                <div style={{height: '76vh'}}>
                  <DataGrid
                    rows={response}
                    columns={columns}
                    columnBuffer={50}
                    rowHeight={50}
                    pageSize={pageSize}
                    disableSelectionOnClick
                  />
                </div>
              )

              : <span>Loading...</span>
          }

        </Card.Body>
      </Card>

    </Container>
  );
}

export default SearchResults;
