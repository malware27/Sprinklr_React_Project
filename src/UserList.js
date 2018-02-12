import React, {Component} from "react";
import {controller} from "./index";

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
            tasklist:props.tasklist
        };
        this.onTaskDelete = this.onTaskDelete.bind(this);
        this.allowdrop = this.allowdrop.bind(this);
        this.drag = this.drag.bind(this);
        this.drop = this.drop.bind(this);
    }
    onTaskDelete(event){
        let data = controller.deleteTask(event);
        this.setState({
            tasklist:data
        });
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
        let prevUserID = taskID.split("-")[0];
        let newUserID = event.target.closest(".userlist-element").id.substr(4);
        let data = controller.changeUserOfTask(taskID,prevUserID,newUserID);
        this.setState({
            userlist:data
        });
    }
    render() {
        let tasks = this.props.tasklist;
        let taskComponents = [];
        for (let i in tasks) {
            if(this.props.filtertask['All'] || this.props.filtertask[tasks[i].status]) {
                taskComponents.push(<Task name={tasks[i].name} id={tasks[i].id} drag={this.props.drag}
                                          status={tasks[i].status} dueDate={tasks[i].dueDate} key={tasks[i].id}
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
    constructor(props){
        super(props);
        this.state = {
            userlist:props.userlist
        };
        this.allowdrop = this.allowdrop.bind(this);
        this.drag = this.drag.bind(this);
        this.drop = this.drop.bind(this);
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
        let prevUserID = taskID.split("-")[0];
        let newUserID = event.target.closest(".userlist-element").id.substr(4);
        let data = controller.changeUserOfTask(taskID,prevUserID,newUserID);
        this.setState({
            userlist:data
        });
    }
    render() {
        let userList = this.state.userlist;
        let usersComponents = [];
        for (let i in userList) {
            usersComponents.push(<User userid={userList[i].id} userName={userList[i].name} drag={this.drag}
                                       key={userList[i].id} tasklist={userList[i].tasklist} allowdrop = {this.allowdrop}
                                        addtask={this.props.addtask} drop={this.drop} edittask={this.props.edittask}/>);
        }
        return (
            <div className="userlists" id="userlists">
                {usersComponents}
            </div>
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