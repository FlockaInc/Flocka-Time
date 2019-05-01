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
    userStopTime: function() {
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
    createTimeInstance: function() {
        this.timeInstance = database.ref("time/users/" + auth.uid + "/").push({}).key;

        console.log("Current time instance: " + this.timeInstance);
    },
    updateTime: function(action) {
        var timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");
        var obj = {};

        obj[action] = timestamp;
        
        database.ref("time/users/" + auth.uid + "/" + this.timeInstance + "/").update(obj);
    },
    getTime: function() {
        firebase.database().ref('time/users/' + auth.uid + "/")
            .once('value', function (snapshot) {
                data.timeObject = snapshot.val();
                
                // Must use notification service since to trigger synchronous event
                notificationService.postNotification('TIME_FETCHED', null);
        });
    },
    calculateTotalTime: function() {
        var keys = Object.keys(this.timeObject);
        var dayIndex = 0;
        var i;
        var j;

        this.totalTime = 0;

        if (keys.length === 1) {
            if (this.timeObject.keys[0].stop !== undefined) {
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

                    console.log(this.timeObject[keys[i]].start)
                    console.log(this.timeObject[keys[i]].stop)
                    console.log(dayIndex);

                    console.log(this.timeLastWeek[dayIndex]);
                }
                else {
                    console.log("null time: " + keys[i]);
                }
            }
        }

        this.timeLastWeek = this.timeLastWeek.reverse();

        console.log(this.timeLastWeek + " minutes");
    },
    parseTimestamp: function(start, stop) {
        start = moment(start);
        stop = moment(stop);

        var timeDiff = stop.diff(start, "minutes");

        return timeDiff;
    },
    determineThisWeek: function(timestamp) {
        var dayDiff = moment().diff(timestamp, "days");

        return dayDiff;
    }
}