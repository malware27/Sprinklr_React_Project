 let data = {
    1: {
        id: 1,
        name: 'Kishan',
        tasklist: {
            "1-0": {
                name: "blah",
                id: "1-0",
                status: "ToDo",
                dueDate: "13 February, 2018"
            },
            "1-1": {
                name: "blah",
                id: "1-1",
                status: "ToDo",
                dueDate: "13 February, 2018"
            }
        },
        length:2
    },
    2: {
        id: 2,
        name: 'Mohit',
        tasklist: {
            "2-0": {
                name: "blah",
                id: "2-0",
                status: "ToDo",
                dueDate: "13 February, 2018"
            },
            "2-1": {
                name: "blah",
                id: "2-1",
                status: "ToDo",
                dueDate: "13 February, 2018"
            }
        },
        length:2
    }
}
Object.defineProperty(data,"length",{
    value:3,
    writable:true,
    configurable:true,
    enumerable:false
});

function fetchData() {
    dumbUsers();
    for(let i in localStorage){
        if(!localStorage.hasOwnProperty(i))
            continue;
        let val = localStorage.getItem(i);
        data[i]=JSON.parse(val);
        data.length = data.length+1;
    }
    return data;
}

function dumbUsers() {
    let temp = {
        id: 1,
        name: 'Kishan',
        tasklist: {
            "1-0": {
                name: "blah",
                id: "1-0",
                status: "ToDo",
                dueDate: "13 February, 2018"
            },
            "1-1": {
                name: "blah",
                id: "1-1",
                status: "ToDo",
                dueDate: "13 February, 2018"
            }
        },
        length:2
    };
    localStorage.setItem("1",JSON.stringify(temp));
    temp = {
        id: 2,
        name: 'Mohit',
        tasklist: {
            "2-0": {
                name: "blah",
                id: "2-0",
                status: "ToDo",
                dueDate: "13 February, 2018"
            },
            "2-1": {
                name: "blah",
                id: "2-1",
                status: "ToDo",
                dueDate: "13 February, 2018"
            }
        },
        length:2
    };
    localStorage.setItem("2",JSON.stringify(temp));
}
function saveData(key,value) {
    localStorage.setItem(key,JSON.stringify(value));
}

export let removeTask = function removeTask(taskID,userID) {
    delete data[userID].tasklist[taskID];
    return data;
}
export {data,saveData,fetchData};