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

}