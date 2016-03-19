'use strict';
var socket = io.connect('http://morningpoopsquad.horse:4001');
///


var users = ["dookie_blastin"];

function register() {
    var input = $('#userSel').val();
    if(input === "")
        input = "dookie_blastin"; // default
    console.log('registering as ' + input);
    socket.emit('join', {room: input});

}

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });

});

socket.on('user registered', function(data) {
    console.log('reg: ' + JSON.stringify(data));
    $('select#userSel').html("");
    users = data.rooms;
    users.forEach(function(user) {
        if(user && user != 'null' && user != 'undefined') {
            $('select#userSel').append($('<option>' + user + '</option>'));
        }
    });
});

$(document).ready(function() {
    console.log('wat');
    register();
//    socket.emit('map', {map: 'house', room: room});

});

var selected = function() {
    register();
    var map = $('select#mapSel').val();
    var room = $('select#userSel').val();
    console.log('changing ' + room + ' to ' + map);
    socket.emit('map', {map: map, room: room});

}
