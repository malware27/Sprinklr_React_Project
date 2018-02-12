import {App,Header} from "./App";
import {Fragment} from "react";
import React from 'react';
import {Routes} from "./BrowserRoutes";

function Main(props) {
    return(
        <Fragment>
            <Header/>
            <Routes/>
        </Fragment>
    );
}

export {Main}