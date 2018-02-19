 let data = {

}

function fetchData() {
    return new Promise(function (resolve) {
       const randomTime = (Math.random()+5)*1000;
       setTimeout(()=> resolve(data)
       ,randomTime);
    });
}

function fetchUsers() {
    let users = JSON.parse(localStorage.getItem("users"));
    return users;
}

function fetchTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    return tasks;
}

function saveUsers() {
    localStorage.setItem("users",JSON.stringify(data.users));
}
function saveTasks() {
    localStorage.setItem("tasks",JSON.stringify(data.tasks));
}

function createLocalModel() {
    //dumbUsers();
    let users = fetchUsers();
    data["users"]=users;
    let tasks = fetchTasks();
    data["tasks"]=tasks;
    return data;
}

function dumbUsers() {
    let users = {
        byid:{
            0:{
                name:"User1",
                role:"Developer",
                taskIds:[0,1]
            },
            1:{
                name:"User2",
                role:"Developer",
                taskIds:[2,3]
            }
        },
        ids:[0,1],
        length:2
    }
    let tasks = {
        byid:{
            0:{
                name:"Do this",
                dueDate:"13 February,2018",
                status:"ToDo",
                assignedUserId:0
            },
            1:{
                name:"Do that",
                dueDate:"13 February,2018",
                status:"ToDo",
                assignedUserId:0
            },
            2:{
                name:"Do this",
                dueDate:"13 February,2018",
                status:"ToDo",
                assignedUserId:1
            },
            3:{
                name:"Do that",
                dueDate:"13 February,2018",
                status:"ToDo",
                assignedUserId:1
            }
        },
        ids:[0,1,2,3],
        length:4
    }
    localStorage.setItem("users",JSON.stringify(users));
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
function saveData(key,value) {
    localStorage.setItem(key,JSON.stringify(value));
}

function removeTask(taskID,userID) {
    delete data[userID].tasklist[taskID];
    return data;
}
export {data,saveData,fetchData,createLocalModel,saveUsers,saveTasks};