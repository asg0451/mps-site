'use strict';
var socket = io.connect('http://morningpoopsquad.horse:4001');
///


var users = ["dookie_blastin"];

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
    console.log('pls');
    socket.emit('userlist pls');
});

var selected = function() {
    var map = $('select#mapSel').val();
    var room = $('select#userSel').val();
    console.log('changing ' + room + ' to ' + map);
    socket.emit('map', {map: map, room: room});

};
