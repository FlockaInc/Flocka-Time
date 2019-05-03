var data = {
  userCodeTime: null,
  allUserFlockalogs: {},
  flockaflag: false,
  handleSignin: function () {
    // check users node if the currently authenticated user uses vscode
    var uid = auth.uid;

    firebase.database().ref('/users/' + uid).once('value').then(function (userSnapshot) {
      var user = userSnapshot.val();
      console.log(user);
      if (user.flocka !== undefined && user.flocka) {
        data.flockaflag = true;
        data.downloadFlockalogs();
      } else {
        data.flockaflag = false;
      }
    });
  },
  createUser: function (email) {
    database.ref("users/" + auth.uid + "/").set(email);
  },
  everyUser: {}, // Object containing all users and child objects of those users
  getEveryUser: function () {
    firebase.database().ref('/users').once('value').then(function (snapshot) {
      data.everyUser = snapshot.val();

      notificationService.postNotification('USERS_FETCHED', null);
    });
  },
  timeInstance: "", // Id that represents an instance of user tracking their time 
  timeObject: {}, // Contains all time instances that user has tracked, fetched from Firebase
  timeLastWeek: new Array(7).fill(0), // Array that contains total time for each day, previous 7 days
  allTime: {}, // Object containing all time instances and child objects of those instances, by user
  createTimeInstance: function () { // Creates a child on the time node in Firebase, per user
    this.timeInstance = database.ref("time/users/" + auth.uid + "/").push({}).key;

    console.log("Current time instance: " + this.timeInstance);
  },
  updateTime: function (action) { // Updates the time instance with a start or stop timestamp
    var timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");
    var obj = {};

    obj[action] = timestamp;

    database.ref("time/users/" + auth.uid + "/" + this.timeInstance + "/").update(obj);
  },
  downloadFlockalogs: function () {
    this.allUserFlockalogs = {};
    // download all flockalog data and store in property "allUserFlockalogs" - should be called on page load
    // 15 mins = 900,000 ms
    let flockalogSnapshot = firebase.database().ref('/flockalogs').once('value');
    let usersSnapshot = firebase.database().ref('/users').once('value');

    console.log('downloadFlockalogs');
    var self = this;

    return Promise.all([flockalogSnapshot, usersSnapshot]).then(function (snapshot) {
      var flockalogs = snapshot[0].val();
      var users = snapshot[1].val();

      var allUsers = {};
      for (var uid in flockalogs.users) {
        // allUsers[uid] = [];
        allUsers[users[uid].email] = [];
        var prevTimestamp = 0;

        for (var user in users) {
          if (uid === user) {
            username = users[user].email;
          }
        }

        var user = flockalogs.users[uid];
        var currentDay = null;
        var prevDay = null;
        var codeTime = 0;
        var delta = 0;
        for (var pushId in user) {
          var currentTimestamp = user[pushId].timestamp;
          delta = currentTimestamp - prevTimestamp;
          currentDay = moment(currentTimestamp).format('YYYY-MM-DD');

          if (prevTimestamp === 0) {
            prevTimestamp = currentTimestamp;
            prevDay = currentDay;
          } else {
            if (currentDay != prevDay) {
              var dailyTime = {
                time: codeTime,
                date: prevDay
              };
              // allUsers[uid].push(dailyTime);
              allUsers[users[uid].email].push(dailyTime);

              codeTime = 0;
            }

            if (delta <= 900000) {
              // if the gap in saves is less than 15 minutes
              codeTime += delta;
            }
            prevDay = currentDay;
            prevTimestamp = currentTimestamp;
          }
        }

        var dailyTime = {
          time: codeTime,
          date: prevDay
        };
        // allUsers[uid].push(dailyTime);
        allUsers[users[uid].email].push(dailyTime);
      }

      console.log(allUsers);

      self.allUserFlockalogs = allUsers;
      notificationService.postNotification('DATA_FLOCKALOGS_DOWNLOADED', null);
    });
  },
  getFlockalogsLeaderboard: function () {
    // ms in a day = 86,400,000
    var keys = Object.keys(this.allUserFlockalogs);
    var leaderboard = [];
    // number of days since the unix epoch
    var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);
    console.log('today: ' + today);
    if (keys.length) {
      for (var username in this.allUserFlockalogs) {
        var user = {
          username: username,
          dailyAvg: 0,
          total: 0
        };
        var dayCount = 0;
        var codeTime = 0;
        for (var dailyTime of this.allUserFlockalogs[username]) {
          var currentDay = Math.floor(moment(dailyTime.date).valueOf() / 86400000);
          var daysFromToday = today - currentDay;

          if (daysFromToday <= 6) {
            codeTime += dailyTime.time;
            dayCount++
          }
        }
        user.total = codeTime / 1000 / 3600;
        user.dailyAvg = user.total / dayCount;
        leaderboard.push(user);
      }

      leaderboard.sort(function (a, b) { return (b.total - a.total) });
    }

    return leaderboard;
  },
  getCurrentUserDailyFlockatime: function () {
    // returns the current user's daily code time for the past 7 days
    // code time reported in hours
    var keys = Object.keys(this.allUserFlockalogs);
    if (keys.length) {
      var myFlockalogs = this.allUserFlockalogs[auth.email];
      for (var i = 0; i < myFlockalogs.length; i++) {
        myFlockalogs[i].time = myFlockalogs[i].time / 1000 / 3600;
      }

      var lastSevenDaysFlockalogs = [];
      var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);

      for (var log of myFlockalogs) {
        var currentDay = Math.floor(moment(log.date).valueOf() / 86400000);
        var daysFromToday = today - currentDay;

        if (daysFromToday <= 6) {
          lastSevenDaysFlockalogs.push(log);
        }
      }

      console.log(lastSevenDaysFlockalogs);
      return lastSevenDaysFlockalogs;
    }
  },
  getTime: function () { // Fetches all time instances from Firebase
    firebase.database().ref('time/users/' + auth.uid + "/")
      .once('value', function (snapshot) {
        data.timeObject = snapshot.val();

        notificationService.postNotification('TIME_FETCHED', null);
      });
  },
  calculateTotalTime: function () { // Calculates total time for the previous week and filters per day
    var keys = Object.keys(this.timeObject);
    var dayIndex = 0;
    var i;
    var j;

    if (keys.length === 1) { // If only one time instance exists, avoid executing the loop - this violates DRY, but to avoid scoping issues...
      if (this.timeObject.keys[0].stop !== undefined) { // Protect against instance where no start timestamp exists
        dayIndex = this.determineThisWeek(this.timeObject[keys[0]].start);

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
            this.timeLastWeek[dayIndex] += this.parseTimestamp(this.timeObject[keys[i]].start, this.timeObject[keys[i]].stop);
          }
        }
        else {
          console.log("null time: " + keys[i]);
        }
      }
    }

    this.timeLastWeek = this.timeLastWeek.reverse(); // Make array in ascending days order

    console.log(this.timeLastWeek + " minutes");
  },
  parseTimestamp: function (start, stop) { // Use Moment JS to determine the time between timestamps in minutes
    start = moment(start);
    stop = moment(stop);

    var timeDiff = stop.diff(start, "minutes", true);

    return timeDiff;
  },
  determineThisWeek: function (timestamp) { // Determines how many days ago the time instance was
    var dayDiff = moment().diff(timestamp, "days");

    return dayDiff;
  },
  getAllTime: function () {
    firebase.database().ref('time/users/').once('value').then(function (snapshot) {
      data.allTime = snapshot.val();

      data.parseAllTime();

      notificationService.postNotification('ALL_TIME_FETCHED', null);
    });
  },
  parseAllTime: function () {
    var userKeys = Object.keys(this.everyUser);
    var timeUserKeys = Object.keys(this.allTime);
    var i;
    var j;
    var k = userKeys.length;
    var l = timeUserKeys.length;
    var payload = [];

    for (i = 0; i < k; i++) {
      for (j = 0; j < l; j++) {
        if (userKeys[i] === timeUserKeys[j]) {
          var timeObject = this.allTime[userKeys[i]];
          var totalTime = this.determineTotalTime(timeObject);
          var avgTime = totalTime[0] / totalTime[1];

          payload.push(
            {
              dailyAvg: avgTime,
              total: totalTime[0],
              username: this.everyUser[userKeys[i]].email
            });
        }
      }
    }
    console.log(payload);
  },
  determineTotalTime: function (timeObject) { // Calculates total time for the previous week and filters per day
    var keys = Object.keys(timeObject);
    var dayIndex = 0;
    var i;
    var j;
    var totalTime = 0;
    var days = 1;

    if (keys.length === 1) { // If only one time instance exists, avoid executing the loop - this violates DRY, but to avoid scoping issues...
      if (timeObject.keys[0].stop !== undefined) { // Protect against instance where no start timestamp exists
        dayIndex = this.determineThisWeek(timeObject[keys[0]].start);
        days = 1;

        if (dayIndex < 7) {
          totalTime += this.parseTimestamp(timeObject[keys[0]].start, timeObject[keys[0]].stop);
        }
      }
      else {
        console.log("null time: " + keys[0]);
      }
    }
    else if (keys.length !== 0) {
      for (i = 0, j = keys.length; i < j; i++) {

        if (timeObject[keys[i]].stop !== undefined) {
          dayIndex = this.determineThisWeek(timeObject[keys[i]].start);
          days = 7;

          if (dayIndex < 7) {
            totalTime += this.parseTimestamp(timeObject[keys[i]].start, timeObject[keys[i]].stop);
          }
        }
        else {
          console.log("null time: " + keys[i]);
        }
      }
    }

    return [totalTime, days];
  },
  buildTableTimeData: function () {
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

    if (!timeString) {
      timeString = '0 minutes';
    }

    return timeString;
  }
}
var authObserver = notificationService.addObserver('AUTH_SIGNIN', this, data.handleSignin);
