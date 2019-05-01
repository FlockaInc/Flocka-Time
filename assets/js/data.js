var data = {
  userCodeTime: null,
  getUserCodeTime: function () {
    if (auth.uid) {
      firebase.database().ref('/codeTime/users/' + auth.uid).once('value', function (codeTimeSnapshot) {
        var codeTime = codeTimeSnapshot.val();
        data.userCodeTime = codeTime;
        console.log(codeTime);
      });
    }
  },
  createUser: function (uid, emailObj) {
    console.log(auth.uid);
    firebase.database().ref("/users/" + uid + "/").set(emailObj).catch(function (error) {
      console.log(error.code);
    });
  },
  userStartTime: function () {
    var userId = auth.uid;
    if (auth.uid) {
      var sessionsRef = firebase.database().ref("sessions");
      sessionsRef.push({
        startedAt: firebase.database.ServerValue.TIMESTAMP
      });
      database.ref("codeTime/users/" + userId + "/startedAt").set(firebase.database.ServerValue.TIMESTAMP);
    }
  },
  userStopTime: function () {
    var userId = auth.uid;
    if (auth.uid) {
      var sessionsRef = firebase.database().ref("sessions");
      sessionsRef.push({
        stoppedAt: firebase.database.ServerValue.TIMESTAMP
      });
      database.ref("codeTime/users/" + userId + "/stoppedAt").set(firebase.database.ServerValue.TIMESTAMP);
    }
  },
  timeInstance: {
    id: ""
  },
  createTimeInstance: function () {
    this.timeInstance.id = database.ref("time/users/" + auth.uid + "/").push({}).key;

    console.log("Current time instance: " + this.timeInstance.id);
  },
  updateTime: function (action) {
    var timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");
    var timeObject = {};

    timeObject[action] = timestamp;

    database.ref("time/users/" + auth.uid + "/" + this.timeInstance.id + "/").update(timeObject);
  },
  timeObject: {},
  getTime: function () {
    firebase.database().ref('time/users/' + auth.uid + "/")
      .once('value', function (snapshot) {
        data.timeObject = snapshot.val();

        // Must use notification service since to trigger synchronous event
        notificationService.postNotification('TIME_FETCHED', null);
      });
  },
  getFlockalogs: function() {
    // 15 mins = 900,000 ms
    let flockalogSnapshot = firebase.database().ref('/flockalogs').once('value');
    let usersSnapshot = firebase.database().ref('/users').once('value');

    console.log('getFlockalogs');

    return Promise.all([flockalogSnapshot, usersSnapshot]).then(function(data) {
      var flockalogs = data[0].val();
      var users = data[1].val();

      var allUsers = [];
      for (var uid in flockalogs.users) {
        var totalTime = 0;
        var prevTimestamp = 0;
        var username;

        for (var user in users) {
          if (uid === user) {
            username = users[user].email;
          }
        }
        
        var userObj = {
          uid: uid,
          username: username
        }

        // console.log(userObj);

        var user = flockalogs.users[uid];
        for (var pushId in user) {
          var currentTimestamp = user[pushId].timestamp;
          var delta = currentTimestamp - prevTimestamp;
          if (prevTimestamp === 0) {
            prevTimestamp = currentTimestamp;
          } else if (delta < 900000) {
            totalTime += delta;
            prevTimestamp = currentTimestamp;
          }
        }
        userObj['totalTime'] = (totalTime / 60000);
        allUsers.push(userObj);
      }

      return allUsers;
    });
  },
  totalTime: "",
  calculateTotalTime: function () {
    var keys = Object.keys(this.timeObject);
    var i;
    var j;

    this.totalTime = 0;

    if (keys.length === 1) {
      if (this.timeObject.keys[0].stop !== undefined) {
        this.totalTime += this.parseTimestamp(this.timeObject[keys[0]].start, this.timeObject[keys[0]].stop);
      }
      else {
        console.log("null time: " + keys[0]);
      }
    }
    else if (keys.length !== 0) {
      for (i = 0, j = keys.length; i < j; i++) {
        if (this.timeObject[keys[i]].stop !== undefined) {
          this.totalTime += this.parseTimestamp(this.timeObject[keys[i]].start, this.timeObject[keys[i]].stop);
        }
        else {
          console.log("null time: " + keys[i]);
        }
      }
    }

    console.log(this.totalTime + " seconds");
  },
  parseTimestamp: function (start, stop) {
    start = moment(start);
    stop = moment(stop);

    timeDiff = stop.diff(start, "seconds");

    return timeDiff;
  }
};