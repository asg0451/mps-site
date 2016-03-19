'use strict';
var socket = io.connect('http://morningpoopsquad.horse:4001');
///

var room = "dookie_blastin"; // default

function register() {
    var input = $('input#nameInput').val();
    if(input === "")
        input = "dookie_blastin"; // default
    room = input;
    console.log('registering as ' + room);
    socket.emit('join', {room: room});

}

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });

});

socket.on('update', function(mapData) { // array
    console.log('updating ' + mapData.name);
    refresh(mapData);
});


var refresh = function(mapData) {
    var name = mapData.name;
    var floors = mapData.floors;
    $("div#row").html("");
    floors.forEach(function(floor) {
        $("div#row").append(
            $("<div>", {class: "col-sm-6"}).append(
                $("<h3>" + floor + "</h3>"),
                $("<img>", {class: "img-responsive", src: "/maps/" + name + "/" + floor})
            )
        );
    });
}

$(document).ready(function() {
    console.log('wat');
    register();
    room = "dookie_blastin"; // default
    socket.emit('map', {map: 'house', room: room});

});
