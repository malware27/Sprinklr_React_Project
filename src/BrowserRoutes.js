import React from 'react';
import { Switch, Route } from 'react-router-dom'
import {App} from "./App";
import {MembersList} from "./Team";

function Routes() {
    return(
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/team' component={MembersList}/>
        </Switch>
    );
}

export {Routes};