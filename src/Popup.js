import React, { Component } from 'react';
import {data} from "./Model";

function AddTaskPopup(props) {
    return(
        <div id="addtask-form-popup" className="white-content-addtask">
            <div className = "popup-header"> Add task</div>
            <form id="add-task" onSubmit={props.submittask}>
                Task name<br/>
                <input type="text" id="task-name" name="task-name" required/>
                <br/>
                Task status<br/>
                <select id="task-status">
                    <option value="ToDo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                </select>
                <br/>
                Due date<br/>
                <input type="date" id="duedate" name="duedate" required/>
            </form>
            <button type="submit" form="add-task" value="submit" id="submit-button"
                    data-userid={props.userid}>Submit</button>
            <button value="cancel" id="cancelbutton" onClick={props.cancel}> Cancel</button>
        </div>
    );
}

function EditTaskPopup(props) {
    let taskid = props.taskid.substr(4);
    let userid = taskid.split("-")[0];
    let taskdata = data[userid].tasklist[taskid];
    return(
        <div id="edittask-form-popup" className="white-content-edittask">
            <div className="popup-header">Edit Task</div>
            <form id="edit-task" onSubmit={props.submit}>
                Assigned User<br/>
                <AssignedUserDropDown userid={userid}/>
                <br/>
                Task name<br/>
                <input type="text" id="edit-task-name" name="task-name" required defaultValue={taskdata.name} />
                <br/>
                Task status<br/>
                <select id="edit-task-status">
                    <option value="ToDo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                </select>
                <br/>
                Due date<br/>
                <input type="date" id="due-date" name="duedate" required defaultValue={taskdata.dueDate}/>
            </form>
            <button type="submit" form="edit-task" value="submit" id="submit_button" data-taskid={taskid}>
                Submit</button>
            <button value="cancel" id="cancel_button" onClick={props.cancel}> Cancel</button>
        </div>
    );
}

function AssignedUserDropDown(props) {
    let userdata=data;
    let options=[];
    for(let i in userdata){
        if(i==props.userid) {
            options.push(<option value={i} key={i} selected={true}>{userdata[i].name}</option>)
        }
        else{
            options.push(<option value={i} key={i}>{userdata[i].name}</option>)
        }
    }
    return(
        <select id="assigned-user">
            {options}
        </select>
    );
}
function BlackOverlay() {
    return(
        <div id="fade" className="black-overlay">
        </div>
    );
}

export {AddTaskPopup,EditTaskPopup,BlackOverlay};