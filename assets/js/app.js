$(function () {
  var app = {
    authListener: notificationService.addObserver('AUTH_SIGNIN', this, handleSignIn),
    signOutListener: notificationService.addObserver('AUTH_SIGNOUT', this, handleSignOut),
    flockalogListener: notificationService.addObserver('DATA_FLOCKALOGS_DOWNLOADED', this, handleFlockalogDownload),
    getAllUsersListener: notificationService.addObserver('USERS_FETCHED', this, handleAllUsers),
    getAllTimeListener: notificationService.addObserver('ALL_TIME_FETCHED', this, handleAllTime)
  }

  function handleAllUsers() {
    data.getAllTime();
  }

  function handleAllTime() {
    if (data.flockaflag === false) {
      var flockaTable = data.parseAllTime();

      for (i = 0; i < flockaTable.length; i++) {
        leaderboardDisplay(i, flockaTable[i].username, flockaTable[i].total, flockaTable[i].dailyAvg);
      }

      var flockaDay = (data.calculatePersonalTime())

      for (i = 0; i < flockaDay.length; i++) {
        flockaDayConverted = flockaDay[i].time.toFixed(2);
        flockaDataset.push(flockaDayConverted);
      }
      barGraphDisplay();
    }
  }

  function handleSignIn() {
    console.log('user signed in');
    signInDisplay();
    data.getAllUsers();
  }

  function handleSignOut() {
    // call methods related to auth sign out
    signInDisplay();
  }

  function handleFlockalogDownload() {
    console.log('handling flockalog download');
    //Pulling data for leaderboard and calling function to populate data

    var flockaTable = data.getFlockalogsLeaderboard();

    for (i = 0; i < flockaTable.length; i++) {
      leaderboardDisplay(i, flockaTable[i].username, flockaTable[i].total, flockaTable[i].dailyAvg);
    }
    //Pulling data for user daily time and calling function to display the bar graph
    var flockaDay = (data.getCurrentUserDailyFlockatime())
    for (i = 0; i < flockaDay.length; i++) {
      flockaDayConverted = flockaDay[i].time.toFixed(2);
      flockaDataset.push(flockaDayConverted);
    }
    barGraphDisplay();
  }

  //Renders appropriate sign in/out buttons on display 
  function signInDisplay() {
    if (auth.uid) {
      $(".signOutButton").removeClass("hide");
      $(".codeTimeStop").removeClass("hide");
      $(".codeTimeStart").removeClass("hide");
      $(".signInButton").addClass("hide");
      $(".welcomeContainer").removeClass("hide");
      $("#welcomeElement").text(" Welcome!");
      $('#sign-in-form').modal('hide');
      $("#graphDiv").removeClass("hide");
      $("#leaderboardTableBody").empty();

      $(".apiKey").removeClass("hide");
      $(".apiKey").on("click", function () {
        var state = $(this).attr('data-state');
        if (state === 'hidden') {
          $("#apiShow").empty();
          var p = $("<p>");
          p.addClass('my-auto').text(auth.uid);
          // console.log(auth.uid)
          $("#apiShow").append(p);
          $(this).attr('data-state', 'show');
        } else {
          $("#apiShow").empty();
          $(this).attr('data-state', 'hidden');
        }
      });

    } else {
      $("#leaderboardTableBody").empty();
      $(".signInButton").removeClass("hide");
      $(".codeTimeStop").addClass("hide");
      $(".codeTimeStart").addClass("hide");
      $(".welcomeContainer").addClass("hide");
      $(".signOutButton").addClass("hide");
      $(".apiKey").addClass("hide");

      var row = $("<tr>");
      row.text("*** Sign In To Display Leaderboard ***");
      row.addClass("text-center");
      $("#leaderboardTableBody").append(row);
    }
  }

  //Runs display function at page load to see if user signed in
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
      p.addClass("text-white")
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
    var errorEmail1 = $("<p>");

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
            $(".errorEmail").remove();
            console.log('Sign up button pressed');
            auth.signUp(email, $("#signupPassword").val());
            errorEmail1.addClass("errorEmail1")
            $("#signupEmailEnter").append(errorEmail1);
            errorEmail1.text("Error: Invalid input. Try again.")
            $("#signupEmail").val("");
            $("#signupPassword").val("");
            // $('#sign-in-form').modal('hide');
          } else {
            $(".errorEmail1").remove();
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
      data.updateTime("stop");

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
    $("#apiShow").empty();
    $("#leaderboardTableBody").empty();
    $("#graphDiv").addClass("hide");
    flockaDataset = [];
  });

  $(".signInButton").on("click", function () {
    $(".modal-body").show();
  })
  //D3 bar graph for User Code Time Last 7 Days
var flockaDataset = [];

function barGraphDisplay() {
  var dataset = flockaDataset;
  var svgWidth = 900;
  var svgHeight = 250;
  var barPadding = 5;
  var barWidth = (svgWidth / dataset.length);
  var svg = d3.select('svg').attr("width", svgWidth).attr("height", svgHeight).attr("class", "bar-chart");

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight]);

  var barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function (d) {
      return svgHeight - yScale(d);
    })
    .attr("height", function (d) {
      return yScale(d);
    })
    .attr("fill", "#282828")
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
      var translate = [barWidth * i, 0];
      return "translate(" + translate + ")";
    });

  var text = svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d, i) {
      return d;
    })
    .attr("y", function (d, i) {
      return svgHeight - d - 2;
    })
    .attr("x", function (d, i) {
      return barWidth * i;
    })
    .attr("fill", "white");
};
});

//Creating Leaderboard Display
function leaderboardDisplay(rank, userName, total, dailyAverage) {
  rank++;
  var td1 = $("<td>");
  td1.text(rank);
  var td2 = $("<td>");
  td2.text(userName);
  var td3 = $("<td>");
  td3.text(data.convertTime(total));
  var td4 = $("<td>");
  td4.text(data.convertTime(dailyAverage));

  var row = $("<tr>");
  row.append(td1);
  row.append(td2);
  row.append(td3);
  row.append(td4);

  $("#leaderboardTableBody").append(row);
}