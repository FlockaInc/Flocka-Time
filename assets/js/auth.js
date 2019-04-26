/**
 * Variables
 */

var database = firebase.database();

var auth = {
    uid: "",
    signUp: function(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)

        .then(function (data) {
            var uid = data.user.uid;
            var email = data.user.email;
            var obj = {};

            obj = { email: email };

            database.ref("users/" + uid + "/").set(obj);

            console.log("User created: " + email);
        })

        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
        });
    },
    signIn: function(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
        });
    }
};





/**
 * Authentication state observer
 */

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        auth.uid = user.uid;

        console.log(auth.uid);
    }
    else {

    }
});