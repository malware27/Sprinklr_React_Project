import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import registerServiceWorker from './registerServiceWorker';
import {data, saveData, fetchData, saveUsers, saveTasks, createLocalModel} from "./Model";
import { BrowserRouter } from 'react-router-dom';
import {Main} from "./Main";

let controller = {

    init:function () {
        createLocalModel();
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
        let userID = data.tasks.byid[taskID].assignedUserId;
        let taskList = data.users.byid[userID].taskIds;
        for(let i=0;i<taskList.length;i++)
        {
            if(taskList[i]===taskID){
                taskList.splice(i,1);
                break;
            }
        }
        for(let i=0;i<data.tasks.ids.length;i++){
            if(data.tasks.ids[i]===taskID){
                data.tasks.ids.splice(i,1);
                break;
            }
        }
        delete data.tasks.byid[taskID];
        saveUsers();
        saveTasks();
        return data;
    },

    addTask: function (taskName,taskStatus,dueDate,userId) {
        let newTaskId = data.tasks.length;
        data.tasks.length = data.tasks.length+1;
        data.tasks.byid[newTaskId] = {
            name:taskName,
            dueDate:dueDate,
            status:taskStatus,
            assignedUserId:userId
        }
        data.tasks.ids.push(newTaskId);
        data.users.byid[userId].taskIds.push(newTaskId);
        saveTasks();
        saveUsers();
        return data;
    },
    changeUserOfTask: function (taskID,prevUserID,newUserID) {
        data.tasks.byid[taskID].assignedUserId = newUserID;
        let prevUser =  data.users.byid[prevUserID];
        for(let i=0;i<prevUser.taskIds.length;i++)
        {
            if(prevUser.taskIds[i]==taskID){
                prevUser.taskIds.splice(i,1);
                break;
            }
        }
        data.users.byid[newUserID].taskIds.push(taskID);
        saveTasks();
        saveUsers();
        return data;
    },
    getData: function () {
        return fetchData();
    },
    changeTaskData(taskname,taskstatus,duedate,userid,taskid){
        let task = data.tasks.byid[taskid];
        task.name = taskname;
        task.status = taskstatus;
        task.dueDate = duedate;
        saveTasks();
        return data;
    },
    removeUser(userID){
        let assignedTasks = data.users.byid[userID].taskIds;
        delete data.users.byid[userID];
        for(let i=0;i<data.users.ids.length;i++){
            if(data.users.ids[i]===userID){
                data.users.ids.splice(i,1);
                break;
            }
        }
        assignedTasks.forEach((taskid)=>{
           delete data.tasks.byid[taskid]
           for(let i=0;i<data.tasks.ids.length;i++){
               if(data.tasks.ids[i]==taskid){
                   data.tasks.ids.splice(i,1);
                   break;
               }
           }
        });
        saveUsers();
        saveTasks();
        return data;
    },
    addUser(name,role){
        let id = data.users.length;
        data.users.length = data.users.length + 1;
        data.users.byid[id] = {
            name:name,
            role:role,
            taskIds:[]
        }
        data.users.ids.push(id);
        saveUsers();
        return data;
    },
    editUser(name,role,id){
        data.users.byid[id].name = name;
        data.users.byid[id].role = role;
        saveUsers();
        return data;
    }
}

export {controller};
registerServiceWorker();
controller.init();