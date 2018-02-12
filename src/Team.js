
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
        <div className="memberelement" id={userid}>
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
    }
    deleteUser(event){
        let userId = event.target.closest(".memberelement").id.substr(4);
        let newlist = controller.removeUser(userId);
        this.setState({
           userlist:newlist
        });
    }
    addMember(event){
        console.log(event.target);
        let popUp = <MemberPopup/>
        this.setState({
            popup:popUp
        });
    }
    render(){
        let membersDiv = [];
        let usersdata = this.state.userlist;
        for(let i in usersdata){
            membersDiv.push(<Member userid={usersdata[i].id} username={usersdata[i].name} key={usersdata[i].id}
                                 userrole={usersdata[i].role} delete={this.deleteUser}/>)
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
            <form id="adduser">
                User name<br/>
                <input type="text" id="username" name="username" required={true}/>
                    <br/>
                        User role<br/>
                        <input type="text" id="userrole" name="userrole" required={true}/>
            </form>
            <button type="submit" form="adduser" value="submit" id="submitbutton">
                Submit
            </button>
            <button value="cancel" id="cancelbutton"> Cancel</button>
        </div>
        <div id="fade" className="black_overlay">
        </div>
        </Fragment>
    );
}
export {MembersList};