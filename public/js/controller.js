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

$(document).ready(function() {
    console.log('wat');
    register();
    socket.emit('map', {map: 'house', room: room});

});

var selected = function() {
    register();
    var map = $('select#mapSel').val();
    console.log('changing ' + room + ' to ' + map);
    socket.emit('map', {map: map, room: room});

}
