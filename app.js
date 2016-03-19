var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var controller = require('./routes/controller');
var viewer = require('./routes/viewer');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'map_dir'))); // maps

/// routes

app.use('/', routes);
app.use('/about', about);
app.use('/contact', contact);
app.use('/controller', controller);
app.use('/viewer', viewer);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

// socket.io stuff

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4000);

io.on('connection', function (socket) {

    socket.emit('news', { hello: 'world' });

    socket.on('join', function(data) {
        if(!data.hasOwnProperty('room')) return;
        console.log('joining ' + JSON.stringify(data));
        // leave other rooms except id room
        for(var room in socket.rooms) {
            if (socket.rooms.hasOwnProperty(room) &&
                !room.startsWith('/#')) {
                socket.leave(room);
            }
        }
        var room = data.room;
        socket.join(room);

        var rooms = getAllRooms(io);

        if(rooms.indexOf(room) == -1) {
            rooms.push(room); // new room isnt in socket.rooms yet?
        }

        console.log('rooms: ' + rooms);
        if(rooms.length > 0) {
            io.emit('user registered', {rooms: rooms}); // broadcast
        }
    });

    socket.on('disconnect', function() {
        var allRooms = getAllRooms(io);
        var ourRooms = [];
        for(var room in socket.rooms) {
            if (socket.rooms.hasOwnProperty(room) &&
                !room.startsWith('/#')) {
                 // leave our rooms and remove them from our list of all rooms
                socket.leave(room);
                allRooms.splice(allRooms.indexOf(room), 1);
            }
        }

        io.emit('user registered', {rooms: allRooms});

    });

    socket.on('map', function(data) {
        console.log("map req: " + data);
        var name = data.map;
        var room = data.room;
        var floors = fs.readdir(__dirname + '/map_dir/maps/' + name, function(err, floors) {
            if(!err) {
                io.to(room).emit('update', {name: name, floors: floors}); // broadcast
            } else {
                console.log(err);
            }
        });
    });
});


var getAllRooms = function(io) {
    var rooms = [];
    for(var aroom in io.sockets.adapter.rooms) {
        if(aroom != undefined &&
           aroom != 'undefined' &&
           aroom != null &&
           aroom != 'null' &&
           aroom &&
           io.sockets.adapter.rooms.hasOwnProperty(aroom)) {
            rooms.push(aroom);
        }
    }

    rooms = rooms.filter(r => !r.startsWith('/#'));
    return rooms;
}

module.exports = app;
