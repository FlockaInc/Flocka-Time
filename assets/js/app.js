$(function () {
  var app = {
    authListener: notificationService.addObserver('AUTH_SIGNIN', this, handleSignIn),
    signOutListener: notificationService.addObserver('AUTH_SIGNOUT', this, handleSignOut),
    getTimeListener: notificationService.addObserver('TIME_FETCHED', this, handleTime),
    flockalogListener: notificationService.addObserver('DATA_FLOCKALOGS_DOWNLOADED', this, handleFlockalogDownload),
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
    data.calculateTotalTime(); // This should trigger when display needs to update
  }
  
  function handleFlockalogDownload() {
    // TODO: use this function to get the flockalog data from data.js (using the below functions) and display them on the home page
    console.log('handling flockalog download');
    console.table(data.getFlockalogsLeaderboard());
    console.log(data.getCurrentUserDailyFlockatime());
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
      $('#sign-in-form').modal('hide');
      (console.log("signed in"));

      $(".apiKey").removeClass("hide");
      $(".apiKey").on("click", function (){
        $("#apiShow").empty();
        var p = $("<p>");
        p.text(auth.uid);
        console.log(auth.uid)
        $("#apiShow").append(p);
      })

    } else {
      $(".signInButton").removeClass("hide");
      $(".codeTimeStop").addClass("hide");
      $(".codeTimeStart").addClass("hide");
      $(".welcomeContainer").addClass("hide");
      $(".signOutButton").addClass("hide");
      $(".apiKey").addClass("hide");
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
    var errorEmail = $("<p>");
    var errorEmail1 = $("<p>")

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

          if ((response.isValid === true) || (auth.uid === false)) {
            $(".errorEmail1").remove();
            console.log('Sign up button pressed');
            auth.signUp(email, $("#signupPassword").val());
            errorEmail1.addClass("errorEmail1")
            $("#signupEmailEnter").append(errorEmail1);
            errorEmail1.text("Error: Invalid input. Try again.")
            $("#signupEmail").val("");
            $("#signupPassword").val("");
            // $('#sign-in-form').modal('hide');
          }    
          else{
            $(".errorEmail").remove();
            errorEmail.addClass("errorEmail")
            errorEmail.text("Error: not a valid email address")
            $("#signupEmailEnter").append(errorEmail);
            $("#signupEmail").val("");
            $("#signupPassword").val("");
          }
        }) 
    }
  });

  $(".codeTimeStart").on("click", function () {
    //Setting state to active/inactive depending on if current instance is running
    var state = $(this).attr("state");
    if (state === "active") {
      data.userStartTime();
      data.createTimeInstance();
      data.updateTime("start");
      $(this).attr("state", "inactive");
      $(".codeTimeStop").attr("state", "active");
    }
  })

  $(".codeTimeStop").on("click", function () {
    //Setting state to active/inactive depending on if current instance is running
    var state = $(this).attr("state");
    if (state === "active") {
      data.userStopTime();
      data.updateTime("stop");
      data.getTime();
      $(this).attr("state", "inactive");
      $(".codeTimeStart").attr("state", "active");
    }
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
    signInDisplay();
  });

  $(".signInButton").on("click", function(){
    $(".modal-body").show();
  })


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