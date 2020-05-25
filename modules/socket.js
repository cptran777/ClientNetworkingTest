const { Room } = require('./room');

function setupSocketHandler(io) {
  // For now, we will only do one room
  const room = new Room();

  io.on('connection', (socket) => {
    console.log('client connection');
    socket.join(room.getId());

    const { id, position } = room.getMap().addPerson();
    socket.emit('SetIdentifier', { id, position });

    socket.on('SetColor', ({ color }) => {
      room.getMap().setColor(id, color);
      if (room.getMap().isValid(id)) {
        socket.emit('StartRender', { data: room.getMap().getAllDetails() });
        socket.broadcast.to(room.getId()).emit('NewPerson', { id, ...room.getMap().getDetails(id)});
      }
    });

    socket.on('MoveNode', ({ axis, direction }) => {
      const isDecrement = direction === 'decrement';
      let isSuccessful = false;

      if (axis === 'x') {
        isSuccessful = room.getMap().incrementX(id, isDecrement);
      } else if (axis === 'y') {
        isSuccessful = room.getMap().incrementY(id, isDecrement);
      }

      if (isSuccessful) {
        socket.broadcast.to(room.getId()).emit('MovePerson', { id, ...room.getMap().getDetails(id) });
      }
    });

    socket.on('disconnect', () => console.log('Hello darkness my old friend'));
  });
}

module.exports = setupSocketHandler;