//Function to set signin/out button display if user signed in or not
function signInDisplay() {
  if (auth.uid === "") {
    $(".signOutButton").removeClass("hide");
    $(".welcomeContainer").removeClass("hide");
    $("#welcomeElement").text(" Welcome ");
  } else {
    $(".signInButton").removeClass("hide");
    // $(".signOutButton").addClass("hide");
    // $(".welcomeContainer").addClass("hide");
  }
  console.log(auth);
}

signInDisplay();


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
