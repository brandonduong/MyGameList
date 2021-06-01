import styled from "styled-components";
import {Link} from "react-router-dom";

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

function Logout() {
    return (
        <Link to="/" className={"nav-link"} onClick={logout}>
            Logout
        </Link>
    )
}

export default Logout
