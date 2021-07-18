import React, {Component} from "react";
import styled from "styled-components";
import {Col, Container} from "react-bootstrap";

const Wrapper = styled.div.attrs({
    className: 'container',
})`    padding: 40px 40px 40px 40px;`

export default class Home extends Component {
    constructor(props) {
        super(props);
        //Set default message
        this.state = {
            message: 'Loading...'
        }
    }
    /*
    componentDidMount() {
        //GET message from server using fetch api
        fetch('/api/home')
            .then(res => res.text())
            .then(res => this.setState({message: res}));
    }
     */

    render() {
        return (
            <Container fluid={"sm"} style={{paddingTop: 100, paddingLeft: 20, paddingRight: 20}}>
                <h1 style={{fontSize: 50}}><strong>Rate and record with MyGameList!</strong></h1>
                 <hr style={{height:2}}/>
                {/*<p>{this.state.message}</p>*/}
                <br/>
                <h5 style={{fontSize: 30, paddingRight: '40%', overflow: 'visible', fontFamily:'Monaco'}}>
                    Feel a rush of nostalgia as you look back on all the video games you've enjoyed over the years!
                </h5>
                <br/>
                <h5 style={{fontSize: 30, paddingRight: '40%', overflow: 'visible', fontFamily:'Monaco'}}>
                    Start your journey now by searching for a video game you want to remember forever!
                </h5>


            </Container>
        );
    }
}
