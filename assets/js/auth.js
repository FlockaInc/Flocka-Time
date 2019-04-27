/**
 * Variables
 */

var database = firebase.database();

var auth = {
  uid: "",
  signUp: function (email, password) {
    // Call Firebase method to create user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)

      .then(function (data) {
        var userId = data.user.uid;
        var userEmail = data.user.email;
        var emailObj = { email: userEmail };

        // database.ref("users/" + uid + "/").set(emailObj);
        data.createUser(obj);

        console.log("User created: " + userId);
        console.log("User created: " + userEmail);
      })

      .catch(function (error) {
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
  authListener: firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      auth.uid = user.uid;
      notificationService.postNotification('AUTH_SIGNIN', null);
    }
    else {
      auth.uid = "";
    }
  }),
};