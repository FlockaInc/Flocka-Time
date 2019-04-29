// $(function() {
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
  signOut: function () {
    firebase.auth().signOut().then(function () {
      auth.uid = "";
      notificationService.postNotification('AUTH_SIGNOUT', null);
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

FB.Event.subscribe('auth.authResponseChange', checkLoginState);

function checkLoginState(event) {
  console.log('checking Login State');
  if (event.authResponse) {
    // User is signed-in Facebook.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(event.authResponse, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
        var credential = firebase.auth.FacebookAuthProvider.credential(
          event.authResponse.accessToken);
        // Sign in with the credential from the Facebook user.
        firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        // User is already signed-in Firebase with the correct user.
      }
    });
  } else {
    // User is signed-out of Facebook.
    firebase.auth().signOut();
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}