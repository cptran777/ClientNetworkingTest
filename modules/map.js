const { v4: uuid } = require('uuid');

class Map {
  static height = 500;
  static width = 600;
  static maxX = Math.floor(this.width / 2);
  static minX = -(this.maxX);
  static maxY = Math.floor(this.height / 2);
  static minY = -(this.maxY);

  static coordinatesExist(x, y) {
    return typeof x === 'number' && typeof y === 'number';
  }

  static isValidPosition(x, y) {
    return (x <= this.maxX && x >= this.minX) && (y <= this.maxY && y >= this.minY);
  }

  static getRandomPosition() {
    const x = Map.minX + Math.floor(Math.random() * Map.maxX * 2);
    const y = Map.minY + Math.floor(Math.random() * Map.maxY * 2);

    return { x, y };
  }

  /**
   * Maps a unique id belonging to an element on the map to the element details
   */
  _map = null;

  constructor() {
    this._map = {};
  }

  _setDetails(id, data) {
    this._map[id] = {
      ...this._map[id],
      ...data
    };
  }

  addPerson() {
    const id = uuid();
    const position = Map.getRandomPosition();
    this._setDetails(id, position);

    return { id, position };
  }

  setColor(id, color) {
    this._setDetails(id, { color });
  }

  isValid(id) {
    const details = this.getDetails(id);
    return Map.coordinatesExist(details.x, details.y) && Map.isValidPosition(details.x, details.y) && details.color;
  }

  getDetails(id) {
    return this._map.hasOwnProperty(id) ? { ...this._map[id] } : {};
  }

  getAllDetails() {
    const idKeys = Object.keys(this._map);
    return idKeys.map(key => ({ id: key, ...this._map[key] }));
  }
}

module.exports = { Map };
