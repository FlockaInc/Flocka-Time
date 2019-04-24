// {/* <script src="https://www.gstatic.com/firebasejs/5.10.0/firebase.js"></script> */}
/* <script> */
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHAQNOMMsN4OfyE3V14tdcXZczWHMAahc",
    authDomain: "flocka-time.firebaseapp.com",
    databaseURL: "https://flocka-time.firebaseio.com",
    projectId: "flocka-time",
    storageBucket: "flocka-time.appspot.com",
    messagingSenderId: "176647479098"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var rank;
  var userName;
  var hoursCoded;
  var dailyAverage;
  var languagesUsed;

  var leaderBoard = {
      rank: rank,
      name: userName,
      hoursCoded: hoursCoded,
      dailyAverage: dailyAverage,
      languagesUsed: languagesUsed
  };

  function pushToFirebase(leaderBoard){
      database.ref().push(leaderBoard);
  };

// </script>