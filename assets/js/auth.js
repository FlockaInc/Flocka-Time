// $(function() {
/**
* Variables
*/

var database = firebase.database();

var auth = {
  uid: "",
  signUp: function (email, password) {
    // Call Firebase method to create user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
      var userId = user.user.uid;
      auth.uid = userId;
      var userEmail = user.user.email;
      var emailObj = { email: userEmail };
      console.log(emailObj);

      // data.createUser(emailObj);
      data.createUser(auth.uid, emailObj);

      console.log("User created: " + userId);
      console.log("User created: " + userEmail);
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log("Error code: " + errorCode);
      console.log("Error message: " + errorMessage);
    });
  },
  signIn: function (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log("Error code: " + errorCode);
        console.log("Error message: " + errorMessage);
      });
  },
  signOut: function () {
    firebase.auth().signOut();
  },
  authListener: firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      auth.uid = user.uid;
      notificationService.postNotification('AUTH_SIGNIN', null);
    }
    else {
      auth.uid = "";
      notificationService.postNotification('AUTH_SIGNOUT', null);
    }
  }),
};
