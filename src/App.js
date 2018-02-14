import React, {Component, Fragment} from 'react';
import './App.css';
import {UserList} from "./UserList";
import {AddTaskPopup,EditTaskPopup,BlackOverlay} from "./Popup";
import {controller} from "./index";

class App extends Component {
    constructor(){
        super();
        this.state = {
            userlist:controller.getData(),
            blackOverlay:false,
            editTaskPopup:false,
            addTaskPopup:false,
        };
        this.handleAddTask = this.handleAddTask.bind(this);
        this.submitAddTask = this.submitAddTask.bind(this);
        this.retrieveAddTaskData = this.retrieveAddTaskData.bind(this);
        this.cancelPopup = this.cancelPopup.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.submitEditTask = this.submitEditTask.bind(this);
    }
    handleAddTask(event){
        let userid = event.target.parentNode.id.substr(4);
        this.setState({
            blackOverlay: <BlackOverlay/>,
            addTaskPopup: <AddTaskPopup submittask={this.submitAddTask} userid={userid} cancel={this.cancelPopup}/>
        })
    }
    submitAddTask(event){
        event.preventDefault();
        this.retrieveAddTaskData(event);
    }
    cancelPopup(event){
        this.setState({
           blackOverlay:false,
           editTaskPopup:false,
           addTaskPopup:false
        });
    }
    submitEditTask(event){
        event.preventDefault();
        let taskid = document.getElementById("submit_button").dataset.taskid;
        let prevUserid = taskid.split("-")[0];
        let taskname = document.getElementById("edit-task-name").value;
        let taskstatus = document.getElementById("edit-task-status").value;
        let duedate = document.getElementById("due-date").value;
        controller.changeTaskData(taskname,taskstatus,duedate,prevUserid,taskid);
        let newUserID = document.getElementById("assigned-user");
        newUserID = newUserID.options[newUserID.selectedIndex].value;
        if(prevUserid!=newUserID)
            controller.changeUserOfTask(taskid,prevUserid,newUserID);
        this.setState({
            userlist:controller.getData(),
            blackOverlay:false,
            editTaskPopup:false
        });
    }
    handleEditTask(event){
        if(event.target.tagName==="IMG")
            return;
        let taskid = event.currentTarget.id;
        this.setState({
            blackOverlay:<BlackOverlay/>,
            editTaskPopup:<EditTaskPopup cancel={this.cancelPopup} submit={this.submitEditTask} taskid={taskid}/>
        });
    }
    retrieveAddTaskData(event){
        let taskName = document.getElementById("task-name").value;
        let taskStatus = document.getElementById("task-status");
        taskStatus = taskStatus.options[taskStatus.selectedIndex].value;
        let dueDate = document.getElementById("duedate").value;
        let userId = document.getElementById("submit-button").dataset.userid;
        let newData = controller.addTask(taskName,taskStatus,dueDate,userId);
        this.setState({
            blackOverlay:false,
            addTaskPopup:false,
            userlist:newData
        });
    }
  render() {
    return (
        <Fragment>
            <UserList addtask={this.handleAddTask} edittask={this.handleEditTask} userlist={this.state.userlist} />
            {this.state.addTaskPopup}
            {this.state.editTaskPopup}
            {this.state.blackOverlay}
        </Fragment>
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
