/**
 * Initialize Firebase
 */

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


/**
 * function createUser()
 * Sign up new users
 */

function signUp(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)

        .then(function (data) {
            var uid = data.user.uid;
            var email = data.user.email;
            var obj = {};

            obj[uid] = { email: email };

            database.ref("users/").set(obj);

            console.log("User created: " + email);
        })

        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
        });
}


/**
 * function signIn();
 * Sign in existing users
 */

function signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
        });
}


/**
 * Sign up button event listener
 */

$("button").on("click", function (event) {
    event.preventDefault();

    var button = $(this).val();
    var email = $("#email").val();

    if (button === "signin") {
        signIn(email, $("#password").val());
    }
    else {
        signUp(email, $("#password").val());
    }

    $("#email").val("");
    $("#password").val("");
});


/**
 * Authentication state observer
 */

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var email = user.email;
        var uid = user.uid;

        console.log(email);
        console.log(uid);
    }
    else {

    }
});