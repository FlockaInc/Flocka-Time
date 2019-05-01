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
  createUser: function (email) {
    database.ref("users/" + auth.uid + "/").set(email);
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
  timeInstance: "",
  timeObject: {},
  totalTime: 0,
  timeLastWeek: new Array(7).fill(0),
  createTimeInstance: function () {
    this.timeInstance = database.ref("time/users/" + auth.uid + "/").push({}).key;

    console.log("Current time instance: " + this.timeInstance);
  },
  updateTime: function (action) {
    var timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");
    var obj = {};

    obj[action] = timestamp;

    database.ref("time/users/" + auth.uid + "/" + this.timeInstance + "/").update(obj);
  },
  getFlockalogs: function () {
    // 15 mins = 900,000 ms
    let flockalogSnapshot = firebase.database().ref('/flockalogs').once('value');
    let usersSnapshot = firebase.database().ref('/users').once('value');

    console.log('getFlockalogs');

    return Promise.all([flockalogSnapshot, usersSnapshot]).then(function (data) {
      var flockalogs = data[0].val();
      var users = data[1].val();

      var allUsers = [];
      for (var uid in flockalogs.users) {
        var totalTime = 0;
        var prevTimestamp = 0;
        var username = '';

        for (var user in users) {
          if (uid === user) {
            username = users[user].email;
          }
        }

        var userObj = {
          uid: uid,
          username: username
        }

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

        // converts ms to hours
        userObj['totalTime'] = (totalTime / 60000 / 60);

        if (username !== '') {
          allUsers.push(userObj);
        }
      }

      // sorts allUsers based on total time value
      console.log(allUsers);
      allUsers.sort((a, b) => { return (b.totalTime - a.totalTime) });
      console.log(allUsers);

      return allUsers;
    });
  },
  getTime: function () {
    firebase.database().ref('time/users/' + auth.uid + "/")
      .once('value', function (snapshot) {
        data.timeObject = snapshot.val();

        // Must use notification service since to trigger synchronous event
        notificationService.postNotification('TIME_FETCHED', null);
      });
  },
  calculateTotalTime: function () {
    var keys = Object.keys(this.timeObject);
    var dayIndex = 0;
    var i;
    var j;

    this.totalTime = 0;
    console.log(this.timeObject);
    console.log(keys.length)

    if (keys.length === 1) {
      if (this.timeObject.keys[0].stop !== undefined) {
        dayIndex = this.determineThisWeek(this.timeObject[keys[i]].start);

        if (dayIndex < 7) {
          this.timeLastWeek[dayIndex] = this.parseTimestamp(this.timeObject[keys[0]].start, this.timeObject[keys[0]].stop);
        }
      }
      else {
        console.log("null time: " + keys[0]);
      }
    }
    else if (keys.length !== 0) {
      for (i = 0, j = keys.length; i < j; i++) {

        if (this.timeObject[keys[i]].stop !== undefined) {
          dayIndex = this.determineThisWeek(this.timeObject[keys[i]].start);

          if (dayIndex < 7) {
            this.timeLastWeek[dayIndex] += this.parseTimestamp(this.timeObject[keys[0]].start, this.timeObject[keys[0]].stop);

            console.log(this.timeObject[keys[i]].start)
            console.log(this.timeObject[keys[i]].stop)
          }
        }
        else {
          console.log("null time: " + keys[i]);
        }
      }
    }

    // console.log(this.timeObject);
    console.log(this.timeLastWeek + " seconds");
  },
  parseTimestamp: function (start, stop) {
    start = moment(start);
    stop = moment(stop);

    timeDiff = stop.diff(start, "seconds");

    return timeDiff;
  },
  determineThisWeek: function (timestamp) {
    var dayDiff = moment().diff(timestamp, "days");

    return dayDiff;
  },
  convertTime: function (hours) {
    // takes a floating point value representing hours and converts it to a string
    // in the format of ### hours ## minutes
    var timeString = '';

    var minutes = Math.floor((hours - Math.floor(hours)) * 60);
    hours = Math.floor(hours);

    if (hours !== 0) {
      timeString = hours + ' hrs ';
    }

    if (minutes !== 0) {
      timeString += minutes + ' minutes';
    }

    return timeString;
  }
}
