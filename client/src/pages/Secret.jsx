import {Component} from "react";
import styled from "styled-components";

const Wrapper = styled.div.attrs({
    className: 'container',
})`    padding: 40px 40px 40px 40px;`

export default class Secret extends Component {
    constructor(props) {
        super(props);
        //Set default message
        this.state = {
            message: 'Loading...'
        }
    }
    componentDidMount() {
        //GET message from server using fetch api
        fetch('/api/secret')
            .then(res => res.text())
            .then(res => this.setState({message: res}));
    }
    render() {
        return (
            <Wrapper>
                <h1>Secret</h1>
                <p>{this.state.message}</p>
            </Wrapper>
        );
    }
}
