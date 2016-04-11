'use strict';
var socket = io.connect('http://morningpoopsquad.horse:4001');
///


var users = ["dookie_blastin"];

socket.on('ping', function() {
    socket.emit('pong');
    console.log('pong');
});

socket.on('user registered', function(data) {
    console.log('reg: ' + JSON.stringify(data));
    $('select#userSel').html("");
    users = data.rooms;
    users.forEach(function(user) {
        if(user &&
           user !== 'null' &&
           user !== null &&
           user !== 'undefined' &&
           user !== undefined) {
            $('select#userSel').append($('<option>' + user + '</option>'));
        }
    });
    userSelected();
});


var mapSelected = function() {
    var map = $('select#mapSel').val();
    var room = $('select#userSel').val();
    console.log('changing ' + room + ' to ' + map);
    socket.emit('map', {map: map, room: room});
};

var userSelected = function() {
    var room = $('select#userSel').val();
    console.log('getting rooms current map');
    socket.emit('current map req', {room: room});
}

socket.on('current map is', function(data) {
    var map = data.map;
    console.log('updating mapsel ' + map);
    $('select#mapSel').val(map).prop('selected', true);
});

$(document).ready(function() {
    console.log('pls');
    socket.emit('userlist pls');
    userSelected();
});
