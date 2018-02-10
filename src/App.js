import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
class App extends Component {
  render() {
      let userlist = [
          {
              id:1,
              name:'Kishan',
              tasklist:{
                  "1-0":{
                      name:"blah",
                      id:"1-0",
                      status:"ToDo",
                      dueDate:"13 February, 2018"
                  },
                  "1-1":{
                      name:"blah",
                      id:"1-1",
                      status:"ToDo",
                      dueDate:"13 February, 2018"
                  }
              }
          },
          {
              id:2,
              name:'Mohit',
              tasklist:{
                  "2-0":{
                      name:"blah",
                      id:"2-0",
                      status:"ToDo",
                      dueDate:"13 February, 2018"
                  },
                  "2-1":{
                      name:"blah",
                      id:"2-1",
                      status:"ToDo",
                      dueDate:"13 February, 2018"
                  }
              }
          }
      ];
    return (
        <div>
            <Header/>
            <UserList userlist={userlist}/>
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
          <TaskList tasklist={tasklist}/>
          <img src="images/add_icon.svg" height="20px" class="add-icon"/>
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
          <img src="images/delete_icon.png" height="20px" width="20px" class="delete-icon"/>
          {taskName}
          <p class="duedate">
              <strong>Due date: </strong>{taskDueDate}
          </p>
          <p class="taskdata">
              {taskStatus}
          </p>
      </div>
    );
}

function TaskList(props) {
    let tasks = props.tasklist;
    let taskComponents = [];
    for(let i in tasks){
        taskComponents.
        push(<Task name={tasks[i].name} id={tasks[i].id}
                   status={tasks[i].status} dueDate={tasks[i].dueDate} key={tasks[i].id}/>);
    }
    return(
        <div className="tasklist-element">
            {taskComponents}
        </div>
    );
}
function UserList(props) {
    let userList = props.userlist;
    let usersComponents = userList.map((user)=>{
       return <User userid={user.id} userName={user.name} key={user.id} tasklist={user.tasklist}/>
    });
    return(
        <div class="userlists" id="userlists">
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
export default App;
