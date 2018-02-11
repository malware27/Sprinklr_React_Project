import React, { Component } from 'react';
import './App.css';
import {deleteTask,addTask,init} from './Controller.js';
class App extends Component {
    constructor(){
        super();
        let data = init();
        this.state = {
            userlist:data,
            blackOverlay:false,
            editTaskPopup:false,
            addTaskPopup:false,
        };
        this.handleAddTask = this.handleAddTask.bind(this);
        this.submitAddTask = this.submitAddTask.bind(this);
        this.retrieveAddTaskData = this.retrieveAddTaskData.bind(this);
        this.cancelPopup = this.cancelPopup.bind(this);
        this.onTaskDrag = this.onTaskDrag.bind(this);
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
    retrieveAddTaskData(event){
        let taskName = document.getElementById("task-name").value;
        let taskStatus = document.getElementById("task-status");
        taskStatus = taskStatus.options[taskStatus.selectedIndex].value;
        let dueDate = document.getElementById("duedate").value;
        let userId = document.getElementById("submit-button").dataset.userid;
        let newData = addTask(taskName,taskStatus,dueDate,userId);
        this.setState({
            userlist: newData,
            blackOverlay:false,
            addTaskPopup:false
        });
    }
    onTaskDrag(event){
        event.preventDefault();
    }
  render() {
    return (
        <div>
            <Header/>
            <UserList userlist={this.state.userlist} addtask={this.handleAddTask} drag={this.onTaskDrag}/>
            {this.state.addTaskPopup}
            {this.state.editTaskPopup}
            {this.state.blackOverlay}
        </div>
    );
  }
}

function Header() {
    return(
        <div id="header">
            <div id="header-title">
                Collab
            </div>
            <div id="users-page-link">
                <a href="users.html">Users</a>
            </div>
        </div>
    );
}

function User(props){
    let userid= "user"+props.userid;
    let tasklist = props.tasklist;
    return(
      <div className="userlist-element" id={userid}>
          {props.userName}
          <TaskFilterCheckBox/>
          <hr/>
          <TaskList tasklist={tasklist} drag={props.drag}/>
          <img src="images/add_icon.svg" height="20px" className="add-icon" onClick={props.addtask}/>
      </div>
    );
}


function Task(props){
    let taskName = props.name;
    let taskStatus = props.status;
    let taskDueDate  = props.dueDate;
    let taskclass = `tasklist tasklist-${taskStatus.toLowerCase()}`;
    let taskid = `task${props.id}`;
    return(
      <div className={taskclass} id={taskid}>
          <img src="images/delete_icon.png" height="20px" width="20px" className="delete-icon"
               onClick={props.onDelete}/>
          {taskName}
          <p className="duedate">
              <strong>Due date: </strong>{taskDueDate}
          </p>
          <p className="taskdata">
              {taskStatus}
          </p>
      </div>
    );
}

class TaskList extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            tasklist:props.tasklist
        };
        this.onTaskDelete = this.onTaskDelete.bind(this);
    }
    onTaskDelete(event){
        let data = deleteTask(event);
        this.setState({
            tasklist:data
        });
    }
    render() {
        let tasks = this.props.tasklist;
        let taskComponents = [];
        for (let i in tasks) {
            taskComponents.push(<Task name={tasks[i].name} id={tasks[i].id}
                                      status={tasks[i].status} dueDate={tasks[i].dueDate} key={tasks[i].id}
                                      onDelete={this.onTaskDelete}/>);
        }
        return (
            <div className="tasklist-element" onDragOver={this.props.drag}>
                {taskComponents}
            </div>
        );
    }
}
function UserList(props) {
    let userList = props.userlist;
    let usersComponents = [];
    for(let i in userList){
        usersComponents.push(<User userid={userList[i].id} userName={userList[i].name} drag={props.drag}
                                   key={userList[i].id} tasklist={userList[i].tasklist} addtask={props.addtask}/>);
    }
    return(
        <div className="userlists" id="userlists">
            {usersComponents}
        </div>
    );
}

function TaskFilterCheckBox(){
    let filters = ['All','ToDo','Doing','Done'];
    let filterCheckBoxes = filters.map((str) => {
        let elem = <input type="checkbox" name="filter" value={str} key={str}/>;
           return elem;
        }
    );
    return(
      <form className="filtercheckbox">
          {filterCheckBoxes}
      </form>
    );
}

function BlackOverlay() {
    return(
        <div id="fade" className="black-overlay">
        </div>
    );
}

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

function EditTaskPopup() {
    return(
        <div id="edittask-form-popup" className="white-content-edittask">
            <div className="popup-header">Edit Task</div>
            <form id="edit-task">
                Assigned User<br/>
                <select id="assigned-user">
                </select>
                <br/>
                    Task name<br/>
                    <input type="text" id="edit-task-name" name="task-name" required/>
                        <br/>
                            Task status<br/>
                            <select id="edit-task-status">
                                <option value="ToDo">Todo</option>
                                <option value="Doing">Doing</option>
                                <option value="Done">Done</option>
                            </select>
                            <br/>
                                Due date<br/>
                                <input type="date" id="due-date" name="duedate" required/>
            </form>
            <button type="submit" form="edit-task" value="submit" id="submit_button">Submit</button>
            <button value="cancel" id="cancel_button"> Cancel</button>
        </div>
    );
}
export default App;
