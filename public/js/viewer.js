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

    if(floors.length > 3) {
        $('.map-col').removeClass('col-md-4');
        $('.map-col').addClass('col-md-3');
        $('#r6-row-0').append(
            $('<div>', {class: 'col-md-3 map-col map-col-optional'}).append(
                $('<h3>', {id: 'r6-floor-name-3', class: 'r6-floor-name'}),
                $('<img>', {id: 'r6-map-3', class: 'img-responsive r6-map-img'})
            ));
    }
    else {
        $('.map-col').removeClass('col-md-3');
        $('.map-col').addClass('col-md-4');
        $('.map-col-optional').remove();
    }

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
