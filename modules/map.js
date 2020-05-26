const { v4: uuid } = require('uuid');

class Map {
  static height = 1000;
  static width = 1000;
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

  /**
   * Adjusts thet x coordinate of the node in question
   * @return whether the adjustment was accepted as valid
   */
  incrementX(id, isDecrement) {
    const { x, y } = this.getDetails(id);
    const delta = isDecrement ? -20 : 20;
    if (Map.isValidPosition(x + delta, y)) {
      this._setDetails(id, { x: x + delta, y });
      return true;
    }

    return false;
  }

  incrementY(id, isDecrement) {
    const { x, y } = this.getDetails(id);
    const delta = isDecrement ? -20 : 20;
    if (Map.isValidPosition(x, y + delta)) {
      this._setDetails(id, { x, y: y + delta });
      return true;
    }

    return false;
  }
}

module.exports = { Map };
