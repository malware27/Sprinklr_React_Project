import React, {Component, Fragment} from "react";
import {controller} from "./index";
import {BlackOverlay,AddTaskPopup,EditTaskPopup} from "./Popup";
import {data} from "./Model";

class User extends Component{

    constructor(props){
        super(props);
        this.state={
            filter:{
                "All":true,
                "ToDo":false,
                "Doing":false,
                "Done":false
            }
        };
        this.onfilterSelect = this.onfilterSelect.bind(this);
    }
    onfilterSelect(event){
        let target = event.target;
        if(target.tagName!=="INPUT")
            return;
        let filtername = target.value;
        let presentfilter = this.state.filter;
        let presentState = presentfilter[filtername];
        presentfilter[filtername] = !presentState;
        this.setState({
            filter:presentfilter
        });
    }
    render() {
        let userid = "user" + this.props.userid;
        let tasklist = this.props.tasklist;
        return (
            <div className="userlist-element" id={userid}>
                {this.props.userName}
                <TaskFilterCheckBox filterselect={this.onfilterSelect}/>
                <hr/>
                <TaskList tasklist={tasklist} drag={this.props.drag} allowdrop={this.props.allowdrop}
                          drop={this.props.drop} edittask={this.props.edittask} filtertask={this.state.filter}/>
                <img src="images/add_icon.svg" height="20px" className="add-icon" onClick={this.props.addtask}/>
            </div>
        );
    }
}


function Task(props){
    const MONTHS = ["January", "February","March", "April","May","June",
        "July","August","September","October","November","December"];
    let taskName = props.name;
    let taskStatus = props.status;
    let taskDueDate = new Date(props.dueDate);
    taskDueDate = MONTHS[taskDueDate.getMonth()]+" "+taskDueDate.getDate()+", "+taskDueDate.getFullYear();
    let taskclass = `tasklist tasklist-${taskStatus.toLowerCase()}`;
    let taskid = `task${props.id}`;
    return(
        <div className={taskclass} id={taskid} draggable={true} onDragStart={props.drag} onClick={props.edittask}>
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
            tasklist:props.tasklist,
        };
        this.onTaskDelete = this.onTaskDelete.bind(this);
    }
    onTaskDelete(event){
        let data = controller.deleteTask(event);
        this.setState({
            tasklist:data
        });
    }
    render() {
        let tasks = this.props.tasklist;
        let taskComponents = [];
        for (let i=0;i<tasks.length;i++) {
            let task = data.tasks.byid[tasks[i]];
            if(this.props.filtertask['All'] || this.props.filtertask[task.status]) {
                taskComponents.push(<Task name={task.name} id={tasks[i]} drag={this.props.drag}
                                          status={task.status} dueDate={task.dueDate} key={tasks[i]}
                                          onDelete={this.onTaskDelete} edittask={this.props.edittask}/>);
            }
        }
        return (
            <div className="tasklist-element" onDragOver={this.props.allowdrop} onDrop={this.props.drop}>
                {taskComponents}
            </div>
        );
    }
}
class UserList extends Component{
    constructor(){
        super();
        console.log(controller.getData());
        this.state = {
            userlist:controller.getData(),
            blackOverlay:false,
            addTaskPopup:false,
            editTaskPopup:false
        };
        this.allowdrop = this.allowdrop.bind(this);
        this.drag = this.drag.bind(this);
        this.drop = this.drop.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.submitAddTask = this.submitAddTask.bind(this);
        this.retrieveAddTaskData = this.retrieveAddTaskData.bind(this);
        this.cancelPopup = this.cancelPopup.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.submitEditTask = this.submitEditTask.bind(this);
    }
    allowdrop(event){
        event.preventDefault();
    }
    drag(event){
        event.dataTransfer.setData("text",event.target.id);
    }
    drop(event){
        event.preventDefault();
        let taskID = event.dataTransfer.getData("text");
        taskID = taskID.substr(4);
        let prevUserID = this.state.userlist.tasks.byid[taskID].assignedUserId;
        let newUserID = event.target.closest(".userlist-element").id.substr(4);
        let data = controller.changeUserOfTask(taskID,prevUserID,newUserID);
        this.setState({
            userlist:data
        });
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
        let prevUserid = this.state.userlist.tasks.byid[taskid].assignedUserId;
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
        let taskid = event.currentTarget.id.substr(4);
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
        let userList = this.state.userlist.users.byid;
        let usersComponents = [];
        for (let i in userList) {
            usersComponents.push(<User userid={i} userName={userList[i].name} drag={this.drag}
                                       key={i} tasklist={userList[i].taskIds} allowdrop = {this.allowdrop}
                                        addtask={this.handleAddTask} drop={this.drop} edittask={this.handleEditTask}/>);
        }
        return (
            <Fragment>
                <div className="userlists" id="userlists">
                    {usersComponents}
                </div>
                {this.state.blackOverlay}
                {this.state.addTaskPopup}
                {this.state.editTaskPopup}
            </Fragment>
        );
    }
}

function TaskFilterCheckBox(props){
    let filters = ['All','ToDo','Doing','Done'];
    let filterCheckBoxes = filters.map((str) => {
            let elem;
            if(str==='All') {
                elem = <label key={str}> {str} <input type="checkbox" name="filter"
                                                      value={str} key={str} defaultChecked={true}/>
                </label>
            }
            else{
                elem = <label key={str}> {str} <input type="checkbox" name="filter" value={str} key={str} />
                </label>
            }
            return elem;
        }
    );
    return(
        <form className="filtercheckbox" onClick={props.filterselect}>
            {filterCheckBoxes}
        </form>
    );
}

export {UserList};