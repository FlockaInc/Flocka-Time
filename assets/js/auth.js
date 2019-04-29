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
    // check if user is authenticated with facebook/twitter first
    firebase.auth().signOut().then(function () {
      auth.uid = "";
      notificationService.postNotification('AUTH_SIGNOUT', null);
    });
  },
  firebaseAuthListener: firebase.auth().onAuthStateChanged(function (user) {
    console.log('firebase auth listener fired');
    if (user) {
      auth.uid = user.uid;
      console.log(auth.uid);
      notificationService.postNotification('AUTH_SIGNIN', null);
    }
    else {
      auth.uid = "";
    }
  }),
  checkLoginState: function (event) {
    console.log('checking Facebook Login State');
    if (event.authResponse) {
      console.log(event.authResponse);
      // User is signed-in Facebook.
      var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        console.log(firebaseUser);
        // Check if we are already signed-in Firebase with the correct user.
        if (!auth.isUserEqual(event.authResponse, firebaseUser)) {
          // Build Firebase credential with the Facebook auth token.
          var credential = firebase.auth.FacebookAuthProvider.credential(
            event.authResponse.accessToken);
          // Sign in with the credential from the Facebook user.
          firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
            var errorCode = error.code;
            console.log(errorCode);
          });
        } else {
          // User is already signed-in Firebase with the correct user.
        }
      });
    } else {
      // User is signed-out of Facebook.
      firebase.auth().signOut();
    }
  },
  isUserEqual: function(facebookAuthResponse, firebaseUser) {
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
};

FB.Event.subscribe('auth.authResponseChange', auth.checkLoginState);