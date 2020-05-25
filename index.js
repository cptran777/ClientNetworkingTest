'use strict';
/****************************** INIT DEPENDENCIES ******************************/
// npm dependencies
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const socketIO = require('socket.io');

const routeHandler = require('./routes');

// init server application using express
const app = express();
// const http = require('http').Server(app);

/***************************** INIT CUSTOM MODULES *****************************/

/******************************* INIT MIDDLEWARE *******************************/

// Should allow us to use the assets inside the public folder in the client side codes
app.use(express.static(__dirname + '/client/build/'));

app.use(bodyparser.json());

/********************************* INIT SERVER *********************************/
routeHandler(app);

const http = require('http').createServer(app);
const io = socketIO(http);
const port = process.env.PORT || 3000;

// For now, we will only do one room
const { Room } = require('./modules/room');
const room = new Room();

io.on('connection', (socket) => {
  console.log('client connection');
  socket.join(room.getId());

  const id = room.addPerson();
  socket.emit('Hello darkness my old friend', { cool: true });
  socket.on('ReceivePosition', (position, color) => {
    console.log('received position');
    console.log(position, color);
    const setIsSuccessful = room.setInitialPosition(id, { ...position, color });
    if (!setIsSuccessful) {
      socket.emit('RetryPosition');
    } else {
      console.log('Server emitting new person');
      socket.broadcast.to(room.getId()).emit('NewPerson', room.getPosition(id));
    }
  });

  setInterval(() => {
    socket.emit('Interval', { test: 'interval' });
  }, 10000);
  socket.on('disconnect', () => console.log('goodbye darkness my old friend'));
});

http.listen(port, () => {
  console.log('Listening on port', port);
});