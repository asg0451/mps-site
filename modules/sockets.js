'use strict';

var fs = require('fs');

var roomsMap = new Map(); // set and get

function sockets(app) {

    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    server.listen(4000);

    var sendPing = function() {
        console.log('ping');
        io.emit('ping');
    };

    setInterval(sendPing, 60000); // every minute

    io.on('connection', function (socket) {

        socket.on('pong', function() {
            console.log('pong from: ' + socket.rooms);
        });

        socket.on('join', function(data) {
            if(!data.hasOwnProperty('room')) {
                return;
            }
            console.log('joining ' + JSON.stringify(data));
            // leave other rooms except id room
            for(var aRoom in socket.rooms) {
                if (socket.rooms.hasOwnProperty(aRoom) &&
                    !aRoom.startsWith('/#')) {
                    socket.leave(aRoom);
                }
            }
            var room = data.room;
            socket.join(room);

            // connect to map in map
            var name = 'house';
            if(roomsMap.has(room)) {
                name = roomsMap.get(room);
            } else {
                roomsMap.set(room, 'house');
            }
            console.log(name);
            var floors = fs.readdir(__dirname + '/../map_dir/maps/' + name, function(err, floors) {
                if(!err) {
                    socket.emit('update', {name: name, floors: floors}); // broadcast
                } else {
                    console.log(err);
                }
            });

            var rooms = getAllRooms(io);

            if(rooms.indexOf(room) === -1) {
                rooms.push(room); // new room isnt in socket.rooms yet?
            }

            console.log('rooms: ' + rooms);
            if(rooms.length > 0) {
                io.emit('user registered', {rooms: rooms}); // broadcast
            }
        });

        socket.on('userlist pls', function() {
            socket.emit('user registered', {rooms: getAllRooms(io)});
        });

        socket.on('disconnect', function() {
            var allRooms = getAllRooms(io);
            for(var room in socket.rooms) {
                if (socket.rooms.hasOwnProperty(room) &&
                    !room.startsWith('/#')) {
                    // leave our rooms and remove them from our list of all rooms
                    socket.leave(room);
                    allRooms.splice(allRooms.indexOf(room), 1);
                    roomsMap.delete(room);
                }
            }
            io.emit('user registered', {rooms: allRooms});
        });

        socket.on('map', function(data) {
            console.log("map req: " + JSON.stringify(data));
            var name = data.map;
            var room = data.room;
            var floors = fs.readdir(__dirname + '/../map_dir/maps/' + name, function(err, floors) {
                if(!err) {
                    io.to(room).emit('update', {name: name, floors: floors}); // broadcast
                    roomsMap.set(room, name);
                } else {
                    console.log(err);
                }
            });
        });

        socket.on('current map req', function(data) {
            var room = data.room;
            if(roomsMap.has(room)) {
                console.log('map resp to ' + room + ' ' + roomsMap.get(room));
                socket.emit('current map is', {map: roomsMap.get(room)});
            }
        });
    });


    var getAllRooms = function(io) {
        var rooms = [];
        for(var aroom in io.sockets.adapter.rooms) {
            if(aroom !== undefined &&
               aroom !== 'undefined' &&
               aroom !== null &&
               aroom !== 'null' &&
               aroom &&
               io.sockets.adapter.rooms.hasOwnProperty(aroom)) {
                rooms.push(aroom);
            }
        }

        rooms = rooms.filter(r => !r.startsWith('/#'));
        console.log(roomsMap);
        return rooms;
    };


}

module.exports = sockets;
