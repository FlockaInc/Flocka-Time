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
 * Create user in Firebase
 */

function createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)

        .then(function (data) {
            var uid = data.user.uid;
            var email = data.user.email;
            var obj = {};

            obj[uid] = {email: email};

            database.ref("users/").set(obj);

        })

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

    var email = $("#email").val();

    createUser(email, $("#password").val());

    $("#email").val("");
    $("#password").val("");
});