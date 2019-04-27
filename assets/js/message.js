// click submit, append message to message board
$("#messageButton").on("click", function(){
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

// instead of entering name can have p.text(auth.uid + ": " + messageText)

// push to firebase so it doesn't erase every time we refresh