function createTimeInstance() {
    data.timeInstance = database.ref("time/users/" + auth.uid + "/").push({}).key;
}

function updateTime(action, timestamp) {
    var obj = {};

    obj[action] = timestamp;
    
    database.ref("time/users/" + auth.uid + "/" + data.timeInstance + "/").update(obj);
}

var x = {
    start: "2019-03-29T08:32:13",
    stop: "2019-03-30T12:56:22"
}

var y = {
    start: "2019-03-25T04:48:17",
    stop: "2019-03-26T12:56:22"
}

var z = {
    start: "2017-09-30T01:56:22",
    stop: "2017-09-30T11:24:19"
}

var arr = [x, y, z];

function runTest() {
    for (i = 0; i < 3; i++) {
        createTimeInstance();
        updateTime("start", arr[i].start)
        updateTime("stop", arr[i].stop)
    }
}