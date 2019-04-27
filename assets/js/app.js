auth.uid = "bee25141";
email = "bee25141@gmail.com";
function signInDisplay() {
  if (auth.uid === "bee25141") {
    $(".signOutButton").removeClass("hide");
    $(".welcomeContainer").removeClass("hide");
    $("#welcomeElement").text("Welcome, " + email);
  } else {
    $(".signInButton").removeClass("hide");
  }
}
console.log(auth.uid);

signInDisplay();

$(".signOutButton").on("click", function () {
  firebase.auth().signOut()
});

/**
 * Sign up button event listener
 */

$(authSubmitButton).on("click", function (event) {
  event.preventDefault();



  var button = $(this).val();
  var email = $("#" + button + "Email").val();

  if (button === "signin") {
    console.log('Sign in button pressed');
    auth.signIn(email, $("#signinPassword").val());

    $("#signinEmail").val("");
    $("#signinPassword").val("");
  }
  else if (button === "signup") {
    console.log('Sign up button pressed');
    auth.signUp(email, $("#signupPassword").val());

    $("#signupEmail").val("");
    $("#signupPassword").val("");
  }
});
