import {Button, Col, Form, FormControl, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import { Search } from 'react-bootstrap-icons';
import React, {useState} from "react";
import {useHistory} from "react-router";

function SearchBar() {
    const [ query, setQuery ] = useState('');

    const history = useHistory()

    function onSearch() {
        history.push('/search?q=' + query);
    }

    return (
        <Form inline onSubmit={onSearch}>
            <Form.Row className={"d-flex"}>
                <Col xs={"auto"}>
                    <FormControl type="text" placeholder="Search"
                                 className="me-lg-5"
                                 onChange={e => setQuery(e.target.value)}
                    />
                </Col>
                <Col xs={"auto"} style={{paddingRight: 15}}>
                    <Button type="submit" variant="dark" href={"/search?q=" + query}><Search /></Button>
                </Col>
            </Form.Row>
        </Form>
    )
}

export default SearchBar
