const { v4: uuid } = require('uuid');
const { Map } = require('./map');

class Room {
  _id = 0;
  _map = null;

  constructor() {
    this._id = uuid();
    this._map = new Map();
  }

  getId() {
    return this._id;
  }

  getMap() {
    return this._map;
  }
}

module.exports = { Room };
