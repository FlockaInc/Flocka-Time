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
    timeInstance: {
        id: ""
    },
    createTimeInstance: function() {
        this.timeInstance.id = database.ref("time/users/" + auth.uid + "/").push({}).key;

        console.log("Current time instance: " + this.timeInstance.id);
    },
    updateTime: function(action) {
        var timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");
        var timeObject = {};

        timeObject[action] = timestamp;
        
        database.ref("time/users/" + auth.uid + "/" + this.timeInstance.id + "/").update(timeObject);
    },
    timeObject: {},
    getTime: function() {
        firebase.database().ref('time/users/' + auth.uid + "/" + this.timeInstance.id + "/")
            .once('value', function (snapshot) {
                data.timeObject = snapshot.val();
                
                // Must use notification service since to trigger synchronous event
                notificationService.postNotification('TIME_FETCHED', null);
        });
    },
    totalTime: "",
    calculateTotalTime: function() {
        var start = moment(this.timeObject.start);
        var stop = moment(this.timeObject.stop);

        this.totalTime = stop.diff(start, "minutes");
        console.log(stop.diff(start, "seconds"));
    }
}