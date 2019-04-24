/**
 * Initialize Firebase
 */

// justin's Firebase
var config = {
    apiKey: "AIzaSyBDXT7DJbr7ZW5YI3e618nn0vwXCwqv2yc",
    authDomain: "productivity-app-bd0c2.firebaseapp.com",
    databaseURL: "https://productivity-app-bd0c2.firebaseio.com",
    projectId: "productivity-app-bd0c2",
    storageBucket: "productivity-app-bd0c2.appspot.com",
    messagingSenderId: "972237871314"
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

            obj[uid] = {email: email};

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
    
        .then(function (data) {
            var uid = data.user.uid;
            var email = data.user.email;

            console.log("User signed in: " + email);

        })
    
        .catch(function(error) {
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
        signIn(email,$("#password").val());
    }
    else {
        signUp(email, $("#password").val());
    }
    
    $("#email").val("");
    $("#password").val("");
});