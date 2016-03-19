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

    floors.forEach(function(floor,i) {
        $('#r6-map-'+i).attr('src', '/maps/' + name + '/' + floor);
        $('#r6-floor-name-'+i).html(floor);
        $('#map-name').html(name);
    });
}


$(document).ready(function() {
    register();
    socket.emit('map', {map: 'house', room: room});

});
