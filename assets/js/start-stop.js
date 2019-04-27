$(".codeTimeStart").on("click", function () {
  var userId = auth.uid;
  var sessionsRef = firebase.database().ref("sessions");
  sessionsRef.push({
    startedAt: firebase.database.ServerValue.TIMESTAMP
  });
  database.ref("codeTime/users/" + userId + "/startedAt").set(firebase.database.ServerValue.TIMESTAMP);
})

$(".codeTimeStop").on("click", function () {
  var userId = auth.uid;
  console.log(userId)
  var sessionsRef = firebase.database().ref("sessions");
  sessionsRef.push({
    stoppedAt: firebase.database.ServerValue.TIMESTAMP
  });
  database.ref("codeTime/users/" + userId + "/stoppedAt").set(firebase.database.ServerValue.TIMESTAMP);
})

