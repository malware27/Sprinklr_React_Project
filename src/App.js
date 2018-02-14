import React, {Component, Fragment} from 'react';
import './App.css';
import {UserList} from "./UserList";

class App extends Component {
  render() {
    return (
        <UserList/>
    );
  }
}

function Header(props) {
    return(
        <div id="header">
            <div id="header-title" onClick={()=>{window.location.href = "/"}}>
                 Collab
            </div>
            <div id="users-page-link">
                <a href="/team">Users</a>
            </div>
        </div>
    );
}



export {App,Header};
