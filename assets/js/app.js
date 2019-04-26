function signInDisplay(){
    if (auth.uid = ""){
        $(".signInButton").hide();
        $(".signOutButton").show();
        $(".welcomeContainer").show();
        $("#welcomeElement").show();
        $("#welcomeElement").text("Welcome, " + email);
    }else {
        $(".signInButton").show();
        $(".signOutButton").hide();
        $(".welcomeContainer").hide();
        $("#welcomeElement").hide();
    }
}

$(".signOutButton").on("click", function(){
    firebase.auth().signOut()
});

/**
 * Sign up button event listener
 */

$(signInButton).on("click", function (event) {
  event.preventDefault();

  console.log('Sign in button pressed');

  var button = $(this).val();
  var email = $("#" + button + "Email").val();

  if (button === "signin") {
      auth.signIn(email, $("#signinPassword").val());

      $("#signinEmail").val("");
      $("#signinPassword").val("");
  }
  else if (button === "signup") {
      auth.signUp(email, $("#signupPassword").val());

      $("#signupEmail").val("");
      $("#signupPassword").val("");
  }
});