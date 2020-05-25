const { Room } = require('./room');

function setupSocketHandler(io) {
  // For now, we will only do one room
  const room = new Room();

  io.on('connection', (socket) => {
    console.log('client connection');
    socket.join(room.getId());

    const { id, position } = room.addPerson();
    socket.emit('SetIdentifier', { id, position });

    socket.on('SetColor', ({ color }) => {
      room.getMap().setColor(id, color);
      if (room.getMap().isValid(id)) {
        socket.emit('StartRender', { data: room.getMap().getAllDetails() });
        socket.broadcast.to(room.getId()).emit('NewPerson', { id, ...room.getMap().getDetails(id)});
      }
    });

    socket.on('disconnect', () => console.log('Hello darkness my old friend'));
  });
}

module.exports = setupSocketHandler;