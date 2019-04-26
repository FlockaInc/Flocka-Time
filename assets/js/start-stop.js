$(".codeTimeStart").on("click", function(){
var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  startedAt: firebase.database.ServerValue.TIMESTAMP
});
database.ref("users/" + userId + "/startedAt").set(firebase.database.ServerValue.TIMESTAMP);
})

$(".codeTimeStop").on("click", function(){
var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  stoppedAt: firebase.database.ServerValue.TIMESTAMP
});
database.ref("users/" + userId + "/stoppedAt").set(firebase.database.ServerValue.TIMESTAMP);
})



var userId = auth.uid;