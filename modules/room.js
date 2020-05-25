const { v4: uuid } = require('uuid');

class Map {
  static height = 500;
  static width = 600;
  static isValidPosition(x, y) {
    return (x <= this.width && x >= 0) && (y <= this.height && y >= 0);
  }

  map = null;

  addPerson() {
    const id = uuid();
    this.map[id] = {};
    return id;
  }

  setPosition(id, { x, y, color }) {
    console.log('setPosition for ');
    console.log(id, x, y, color);
    console.log(Map.isValidPosition(x, y));
    console.log(this.map);
    console.log(this.map.hasOwnProperty(id));
    if (Map.isValidPosition(x, y) && this.map.hasOwnProperty(id)) {
      this.map[id] = { x, y, color };
      return true;
    }

    return false;
  }

  incrementX(id, isDecrement) {
    if (this.map.hasOwnProperty(id)) {
      const coordinates = this.map[id];
      const change = isDecrement ? -1 : 1;
      return this.setPosition(id, { ...coordinates, x: coordinates.x + change,  y: coordinates.y });
    }

    return false;
  }

  incrementY(id, isDecrement) {
    if (this.map.hasOwnProperty(id)) {
      const coordinates = this.map[id];
      const change = isDecrement ? -1 : 1;
      return this.setPosition(id, { ...coordinates, x: coordinates.x, y: coordinates.y + change });
    }
  }

  getPosition(id) {
    return this.map[id];
  }

  constructor() {
    this.map = {};
  }
}

class Room {
  id = 0;
  map = null;
  sockets = null;

  constructor(socket) {
    this.id = uuid();
    this.map = new Map();
    this.sockets = {};
  }

  getId() {
    return this.id;
  }

  addSocketForPerson(id, socket) {
    this.sockets[id] = socket;
  }

  addPerson() {
    return this.map.addPerson();
  }

  setInitialPosition(id, position) {
    return this.map.setPosition(id, position);
  }

  getPosition(id) {
    return this.map.getPosition(id);
  }
}

module.exports = { Room };
