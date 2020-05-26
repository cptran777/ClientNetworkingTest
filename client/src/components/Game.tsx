import React, { Component } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import socketIOClient from 'socket.io-client';
import { EventKey, Direction, keyToDirectionMap, getAxisFromDirection, getDeltaFromDirection } from '../utils/keyboard';

interface GameComponentState {}

interface IRenderData {
  id: string;
  color: number;
  x: number;
  y: number;
}

export class Game extends Component<{}, GameComponentState> {
  static colorOptions = [0x81d2ff, 0xf0421d, 0xfb3b2c, 0x50e81f, 0xe81fd9, 0xffc240];
  static height = 1000;
  static width = 1000;
  static maxX = Math.floor(Game.width / 2);
  static minX = -(Game.maxX);
  static maxY = Math.floor(Game.height / 2);
  static minY = -(Game.maxY);

  static isValidPosition(x: number, y: number): boolean {
    return (x <= this.maxX && x >= this.minX) && (y <= this.maxY && y >= this.minY);
  }

  constructor(props: {}) {
    super(props);
    this.state = {};
    this.nodes = {};
    this.checkQueue = [];
  }

  cube?: Mesh;
  color?: number;
  socket?: SocketIOClient.Socket;
  nodes: Record<string, Mesh>;
  scene?: Scene;
  selfId?: string;
  camera?: PerspectiveCamera;
  renderer?: WebGLRenderer;
  checkQueue: Array<{ x: number, y: number }>;

  selectColor() {
    return Game.colorOptions[Math.floor(Math.random() * Game.colorOptions.length)];
  }

  createNode(data: IRenderData) {
    const { color, x, y } = data;
    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshBasicMaterial({ color });
    const cube = new Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    return cube;
  }

  addNode(data: IRenderData) {
    const cube = this.createNode(data);
    this.nodes[data.id] = cube;
    this.scene?.add(cube);
  }

  addSelf(data: IRenderData) {
    const cube = this.createNode(data);
    this.cube = cube;
    this.scene?.add(cube);
  }

  moveCube(direction: Direction) {
    const axis = getAxisFromDirection(direction);
    const delta = getDeltaFromDirection(direction);
    const cube = this.cube;
    
    if (cube && delta) {
      const newX = axis === 'x' ? cube.position.x + delta : cube.position.x;
      const newY = axis === 'y' ? cube.position.y + delta : cube.position.y;

      if (Game.isValidPosition(newX, newY)) {
        cube.position[axis] = cube.position[axis] + delta;
        this.socket?.emit('MoveNode', { axis, direction: delta > 0 ? 'increment' : 'decrement' });
      }
    }
  }

  checkSelf(data: IRenderData) {
    // Check received data from the server to ensure client is in the correct position
  }

  setupSocket() {
    const socket = socketIOClient('/');
    this.socket = socket;

    let initialPosition: { x: number, y: number };

    socket.on('SetIdentifier', (data: { id: string, position: typeof initialPosition }) => {
      const { id, position } = data;
      const color = this.selectColor();
      this.selfId = id;
      initialPosition = position;

      socket.on('StartRender', (data: { data: Array<IRenderData> }) => {
        const { data: nodes } = data;
        this.addSelf({ id, color, x: initialPosition.x, y: initialPosition.y });
        nodes.forEach(node => node.id !== this.selfId && this.addNode(node));
        this.setupKeybinds();
        this.animate();
      });

      socket.on('NewPerson', (data: IRenderData) => data.id !== this.selfId && this.addNode(data));

      socket.on('MovePerson', (data: IRenderData) => {
        if (data.id === this.selfId) {
          this.checkSelf(data);
        } else {
          const movedNode = this.nodes[data.id];
          movedNode.position.x = data.x;
          movedNode.position.y = data.y;
        }
      });

      socket.emit('SetColor', { color });
    });
  }

  init() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 600 / 500, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(600, 500);

    const element = document.getElementById('game-window');
    element?.appendChild(renderer.domElement);
    camera.position.z = 1000;

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const { cube, scene, camera, renderer } = this;
    // Note: Since react setState is asynchronous, cube may not necessarily be defined. We run this
    // check to make sure
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer?.render(scene!, camera!);
    }
  }

  setupKeybinds() {
    // Using window for now since the element keyevent listener doesn't work, probably because it's 
    // a canvas
    window.addEventListener('keydown', (event) => {
      const direction = keyToDirectionMap[event.keyCode as EventKey];
      if (direction) {
        this.moveCube(direction);
      }
    });
  }

  componentDidMount() {
    this.init();
    this.setupSocket();
  }

  render() {
    return (<div id="game-window"></div>);
  }
}