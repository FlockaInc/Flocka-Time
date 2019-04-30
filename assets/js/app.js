$(function () {
  var app = {
    authListener: notificationService.addObserver('AUTH_SIGNIN', this, handleSignIn),
    signOutListener: notificationService.addObserver('AUTH_SIGNOUT', this, handleSignOut),
    getTimeListener: notificationService.addObserver('TIME_FETCHED', this, handleTime),
  }

  function handleSignIn() {
    console.log('user signed in');
    signInDisplay();
  }

  function handleSignOut() {
    // call methods related to auth sign out
    signInDisplay();
  }

  function handleTime() {
    data.calculateTotalTime();
  }

  //Displays appropriate sign in/out buttons on display 
  function signInDisplay() {
    if (auth.uid) {
      $(".signOutButton").removeClass("hide");
      $(".codeTimeStop").removeClass("hide");
      $(".codeTimeStart").removeClass("hide");
      $(".signInButton").addClass("hide");
      $(".welcomeContainer").removeClass("hide");
      $("#welcomeElement").text(" Welcome!");
      (console.log("signed in"));
    } else {
      $(".signInButton").removeClass("hide");
      console.log("signed out");
    }

  }

  //runs display function at page load to see if user signed in
  signInDisplay();

  // api to call ip address of user

  var geoURL = "https://extreme-ip-lookup.com/json/"

  $.ajax({
    url: geoURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response)
      var p = $("<p>")
      p.text("Coding from: " + response.city + ", " + response.region)
      $(".lead").append(p)
    })

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
    } else if (button === "signup") {

      var queryURL = 'https://pozzad-email-validator.p.rapidapi.com/emailvalidator/validateEmail/' + email;

      $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "pozzad-email-validator.p.rapidapi.com",
          "X-RapidAPI-Key": "26e065489amshedaf946a10f08c0p1fb64djsn3860730b77bf"
        }
      })
        .then(function (response) {
          console.log(response)
          console.log(response.isValid)

          if (response.isValid === true) {
            console.log('Sign up button pressed');
            auth.signUp(email, $("#signupPassword").val());

            $("#signupEmail").val("");
            $("#signupPassword").val("");
          }
        })
    }
  });

  $(".codeTimeStart").on("click", function () {
    data.userStartTime();
    data.createTimeInstance();
    data.updateTime("start");
  })

  $(".codeTimeStop").on("click", function () {
    data.userStopTime();
    data.updateTime("stop");
    data.getTime();
  })

  // click submit, append message to message board
  $("#messageButton").on("click", function () {
    event.preventDefault();
    // name to be displayed
    var nameText = $("#inputName").val();
    $("#inputName").val("");

    // text for the message
    var messageText = $("#inputMessage").val();
    $("#inputMessage").val("");
    var p = $("<p>");
    p.text(nameText + ": " + messageText);
    $("#messageDisplay").append(p);
  })

  $(".signOutButton").on("click", function () {
    firebase.auth().signOut();
    location.reload();
  });


  // ** CANVAS TEST **
  function generateDummyChart() {
    var date = moment();
    console.log(date);
    window.onload = function () {
      var chart = new CanvasJS.Chart("chartContainer", {

        title: {
          text: "Code Time (Last 7 Days)"
        },
        data: [{
          type: "line",

          dataPoints: [{
            x: new Date(2012, 03, 1),
            y: 123
          },
          {
            x: new Date(2012, 03, 2),
            y: 106
          },
          {
            x: new Date(2012, 03, 3),
            y: 85
          },
          {
            x: new Date(2012, 03, 4),
            y: 42
          },
          {
            x: new Date(2012, 03, 5),
            y: 69
          },
          {
            x: new Date(2012, 03, 6),
            y: 69
          },
          {
            x: new Date(2012, 03, 7),
            y: 69
          },
          ]
        }]
      });

      chart.render();
    }
  }

  generateDummyChart();
});