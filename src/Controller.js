
import {data,saveData,fetchData} from './Model';

function deleteTask(event) {
    let target = event.target;
    let taskDiv = target.closest(".tasklist");
    let taskId = taskDiv.id;
    let taskID = taskId.substr(4);
    let userID = taskID.split("-")[0];
    delete data[userID].tasklist[taskID];
    console.log(userID);
    console.log(data[userID]);
    saveData(userID,data[userID]);
    return data;
}

function addTask(taskName,taskStatus,dueDate,userId) {
    let newTaskId = userId + "-" + data[userId].length.toString();
    console.log(newTaskId);
    data[userId].length = data[userId].length+1;
    data[userId].tasklist[newTaskId] = {
        name: taskName,
        id: newTaskId,
        status: taskStatus,
        dueDate: dueDate
    };
    saveData(userId,data[userId]);
    return data;
}

function init() {
    return fetchData();
}
export {deleteTask,addTask,init};
