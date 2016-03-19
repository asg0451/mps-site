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
    $("div#mapsCnt").html("");
    $("div#mapsCnt").append($('<div>', {id: 'r6-row-0', class: 'row'}));
    $("div#mapsCnt").append($('<div>', {id: 'r6-row-1', class: 'row'}));
    // split max 4 imgs into two rows
    var cycle = 0;
    floors.forEach(function(floor) {
        if(cycle % 4 < 2) {
            var row = $('div#r6-row-0');
        } else {
            var row = $('div#r6-row-1');
        }
        row.append(
            $("<div>", {class: "col-md-6"}).append(
                $("<h3>" + floor + "</h3>"),
                $("<img>", {class: "img-responsive r6-map-img", src: "/maps/" + name + "/" + floor})
            )
        );
        cycle++;
    });
}

var initImgDivs = function() {
    $("div#mapsCnt").append($('<div>', {id: 'r6-row-0', class: 'row'}));
};

$(document).ready(function() {
    register();
    socket.emit('map', {map: 'house', room: room});

});
