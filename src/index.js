import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import registerServiceWorker from './registerServiceWorker';
import {data, saveData,fetchData} from "./Model";
import { BrowserRouter } from 'react-router-dom';
import {Main} from "./Main";

let controller = {

    init:function () {
        ReactDOM.render(
            <BrowserRouter>
                <Main />
            </BrowserRouter>,
            document.getElementById('root'));
    },
    deleteTask: function(event) {
        let target = event.target;
        let taskDiv = target.closest(".tasklist");
        let taskId = taskDiv.id;
        let taskID = taskId.substr(4);
        let userID = taskID.split("-")[0];
        delete data[userID].tasklist[taskID];
        console.log(userID);
        console.log(data[userID]);
        saveData(userID,data[userID]);
        return data;
    },

    addTask: function (taskName,taskStatus,dueDate,userId) {
        let newTaskId = userId + "-" + data[userId].length.toString();
        data[userId].length = data[userId].length+1;
        data[userId].tasklist[newTaskId] = {
            name: taskName,
            id: newTaskId,
            status: taskStatus,
            dueDate: dueDate
        };
        saveData(userId,data[userId]);
        return data;
    },
    changeUserOfTask: function (taskID,prevUserID,newUserID) {
        let task = data[prevUserID].tasklist[taskID];
        delete  data[prevUserID].tasklist[taskID];
        let len = data[newUserID].length;
        data[newUserID].length = data[newUserID].length + 1;
        let newTaskID = newUserID+"-"+len;
        task.id = newTaskID;
        data[newUserID].tasklist[newTaskID]=task;
        saveData(newUserID,data[newUserID]);
        saveData(prevUserID,data[prevUserID]);
        return data;
    },
    getData: function () {
        return fetchData();
    },
    changeTaskData(taskname,taskstatus,duedate,userid,taskid){
        let task = data[userid].tasklist[taskid];
        task.name = taskname;
        task.status = taskstatus;
        task.dueDate = duedate;
        saveData(userid,data[userid]);
    },
    removeUser(userID){
        delete data[userID];
        return data;
    }
}

export {controller};
registerServiceWorker();
controller.init();