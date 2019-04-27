// $(function() {
  function signInDisplay() {
    if (auth.uid = "") {
      $(".signOutButton").removeClass("hide");
      $(".welcomeContainer").removeClass("hide");
      $("#welcomeElement").text("Welcome, ");
    } else {
      $(".signInButton").removeClass("hide");
    }

  }
  
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
  
  
  // ** CANVAS TEST **
  function generateDummyChart() {
    var date = moment();
    console.log(date);
    window.onload = function () {
      var chart = new CanvasJS.Chart("chartContainer",
        {
  
          title: {
            text: "Code Time (Last 7 Days)"
          },
          data: [
            {
              type: "line",
  
              dataPoints: [
                { x: new Date(2012, 03, 1), y: 123 },
                { x: new Date(2012, 03, 2), y: 106 },
                { x: new Date(2012, 03, 3), y: 85 },
                { x: new Date(2012, 03, 4), y: 42 },
                { x: new Date(2012, 03, 5), y: 69 },
                { x: new Date(2012, 03, 6), y: 69 },
                { x: new Date(2012, 03, 7), y: 69 },
              ]
            }
          ]
        });
  
      chart.render();
    }
  }
  generateDummyChart();
  console.log(auth.uid);
// })
