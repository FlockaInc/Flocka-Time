$(document).ready(function () {

var emailEntered = $("#signinEmail").val();

// $(".authSubmit").on("click", function(){
//   console.log(emailEntered);
// })

var queryURL = 'https://pozzad-email-validator.p.rapidapi.com/emailvalidator/validateEmail/alexbcahn@gmail.com'+ emailEntered;

$.ajax({
  url: queryURL,
  method: "GET",
  headers: {"X-RapidAPI-Host" : "pozzad-email-validator.p.rapidapi.com",
  "X-RapidAPI-Key" : "26e065489amshedaf946a10f08c0p1fb64djsn3860730b77bf"}
})
.then(function (response) {
    console.log(response)
})


// var geoURL = "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/";

// $.ajax({
//   url: geoURL,
//   method: "GET",
//   headers: {"X-RapidAPI-Host" : "ip-geolocation-ipwhois-io.p.rapidapi.type-com",
//   "X-RapidAPI-Key" : "26e065489amshedaf946a10f08c0p1fb64djsn3860730b77bf"}
// })
// .then(function (response) {
//     console.log(response)
// })

var geoURL = "https://extreme-ip-lookup.com/json/"

$.ajax({
url: geoURL,
method: "GET",
})
.then(function (response) {
  console.log(response)
})

})