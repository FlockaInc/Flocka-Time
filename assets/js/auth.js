/**
 * Variables
 */

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

$("button").on("click", function (event) { // This function will run any time any button is clicked, needs to be resolved
    event.preventDefault();

    var button = $(this).val();
    var email = $("#" + button + "Email").val();

    if (button === "signin") {
        signIn(email, $("#signinPassword").val());

        $("#signinEmail").val("");
        $("#signinPassword").val("");
    }
    else if (button === "signup") {
        signUp(email, $("#signupPassword").val());

        $("#signupEmail").val("");
        $("#signupPassword").val("");
    }
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