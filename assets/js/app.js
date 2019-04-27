$("document").ready(function(){


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

signInDisplay();
console.log(auth.uid);
})