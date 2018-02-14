
import React, {Component, Fragment} from 'react';
import {controller} from "./index";
function Temp(){
    return(
      <div>
          "Hello World"
      </div>
    );
}

function Member(props) {
    let userid = "user"+props.userid;
    return(
        <div className="memberelement" id={userid} onClick={props.editUser}>
            <img src="images/delete_icon.png" height="20px" width="20px" align="top right"
                 className="deleteicon" onClick={props.delete}/>
            <img src="images/profile_icon.png" height="100px" width="100px"/>
            <br/>
            {props.username}
            <br/>
            {props.userrole}
        </div>
    )
}

class MembersList extends Component{
    constructor(){
        super();
        this.state={
            userlist:controller.getData(),
            popup:false
        }
        this.deleteUser = this.deleteUser.bind(this);
        this.addMember = this.addMember.bind(this);
        this.cancelAddUser = this.cancelAddUser.bind(this);
        this.handleSubmitAddUser = this.handleSubmitAddUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.handleSubmitEditUser = this.handleSubmitEditUser.bind(this);
    }
    deleteUser(event){
        let userId = event.target.closest(".memberelement").id.substr(4);
        let newlist = controller.removeUser(userId);
        this.setState({
           userlist:newlist
        });
    }
    cancelAddUser(){
        this.setState({
           popup:false
        });
    }
    handleSubmitAddUser(event){
        event.preventDefault();
        let userName = document.getElementById("username").value;
        let userRole = document.getElementById("userrole").value;
        let data = controller.addUser(userName,userRole);
        this.setState({
            userlist:data,
            popup:false
        })
    }
    addMember(event){
        let popUp = <MemberPopup onCancel={this.cancelAddUser} onSubmit={this.handleSubmitAddUser}/>
        this.setState({
            popup:popUp
        });
    }
    editUser(event){
        let target = event.target;
        if(target.tagName!== "DIV")
            return;
        target = event.currentTarget;
        let userid = target.id.substr(4);
        let user = this.state.userlist.users.byid[userid];
        let username = user.name;
        let userrole = user.role;
        let popUp = <MemberPopup onCancel = {this.cancelAddUser} onSubmit = {this.handleSubmitEditUser}
                                 userid={userid} name={username} role={userrole}/>
        this.setState({
            popup:popUp
        });
    }
    handleSubmitEditUser(event){
        event.preventDefault();
        let userid = document.getElementById("submitbutton").dataset.userid;
        let newName = document.getElementById("username").value;
        let newRole = document.getElementById("userrole").value;
        let data = controller.editUser(newName,newRole,userid);
        this.setState({
            popup:false,
            userlist:data
        });
    }
    render(){
        let membersDiv = [];
        let usersdata = this.state.userlist.users.byid;
        for(let i in usersdata){
            membersDiv.push(<Member userid={i} username={usersdata[i].name} key={i}
                                 userrole={usersdata[i].role} delete={this.deleteUser} editUser={this.editUser}/>)
        }
        return (
            <Fragment>
            <div className="memberlist" id="userlist">
                {membersDiv}
                <div className="addelement" id="addbuttondiv">
                    <img src="images/add_icon.svg" height="40px" width="40px" onClick={this.addMember}/>
                </div>
            </div>
            {this.state.popup}
            </Fragment>
        );

    }
}

function MemberPopup(props) {
    return(
        <Fragment>
        <div id="adduserpopup" className="white_content">
            <div className="popup-header">Add user</div>
            <form id="adduser" onSubmit={props.onSubmit}>
                User name<br/>
                <input type="text" id="username" name="username" required={true} defaultValue={props.name}/>
                    <br/>
                        User role<br/>
                        <input type="text" id="userrole" name="userrole" required={true} defaultValue={props.role}/>
            </form>
            <button type="submit" form="adduser" value="submit" id="submitbutton" data-userid={props.userid}>
                Submit
            </button>
            <button value="cancel" id="cancelbutton" onClick={props.onCancel}> Cancel</button>
        </div>
        <div id="fade" className="black_overlay">
        </div>
        </Fragment>
    );
}
export {MembersList};