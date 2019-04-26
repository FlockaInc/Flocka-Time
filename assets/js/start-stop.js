$(".codeTimeStart").on("click", function(){
var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  startedAt: firebase.database.ServerValue.TIMESTAMP
});
})

$(".codeTimeStop").on("click", function(){
var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  stoppedAt: firebase.database.ServerValue.TIMESTAMP
});
})
