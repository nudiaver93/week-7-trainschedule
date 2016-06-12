//Call Firebase URL
var trainData = new Firebase("https://uttrain.firebaseio.com/");

//Create a function that recognizes the information submitted by the user
function newData() {
    $("#submit").on('click', function() {
        var name = $("#nameInpt").val().trim();
        var dest = $("#destInpt").val().trim();
        var freq = $("#freqInpt").val().trim();
        var first = $("#frstInpt").val().trim().split(":");
        var time = moment({hours: first[0],minutes: first[1]}).format("hh:mm");
        // Push this data to firebase
        trainData.push({ name: name, dest: dest, freq: freq, first: time,})
        $(".form-control").val("");
        return false;
    })
}

//Calculate arrival time and time remaining. This information was not submitted by user
function arrival(freq, time) {
    var dif = moment().diff(moment(time, "hh:mm"), "minutes");
    var left = freq - (dif % freq);
    var upcoming = moment().add(left, "minutes");
    return {upcoming: upcoming.format("hh:mm"),remaining: left,};
}

//Call the main function
$(document).ready(function() {
    // Read user input and add to Firebase
    newData();
    // Read data on Firebase
    trainData.on("child_added", function(childSnapshot) {
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var freq = childSnapshot.val().freq;
        var time = childSnapshot.val().first;
        //Create a variable with information to be calculated. This is not on Firebase.
        var next = arrival(freq, time);
        //Append this information to html table
        $("#table > tbody").append('<tr><td>' + name + '</td><td>' + dest + '</td><td>' + freq + '</td><td data-first-time=' + time + '>' + next.upcoming + '</td><td>' + next.remaining + '</td></tr>');});
});