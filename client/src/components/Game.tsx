import React, { Component } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import socketIOClient from 'socket.io-client';

interface GameComponentState {
  cube?: Mesh,
  scene?: Scene,
  renderer?: WebGLRenderer,
  camera?: PerspectiveCamera,
  socket?: SocketIOClient.Socket
}

export class Game extends Component<{}, GameComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
    this.cubes = [];
  }

  cube?: Mesh;
  color?: number;
  socket?: SocketIOClient.Socket;
  cubes: Array<Mesh>;
  scene?: Scene;

  init() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 600 / 500, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(600, 500);

    const element = document.getElementById('game-window');
    element?.appendChild(renderer.domElement);

    const geometry = new BoxGeometry(100, 100, 100);
    const color: number = 0x81d2ff;
    const material = new MeshBasicMaterial({ color });
    const cube = new Mesh(geometry, material);
    cube.position.x = 50 + Math.floor(Math.random() * 400);
    cube.position.y = 50 + Math.floor(Math.random() * 500);
    scene.add(cube);

    camera.position.z = 1000;
    this.cube = cube;
    this.scene = scene;
    this.color = color;
    this.setState({ cube, scene, camera, renderer });
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const { cube, scene, camera, renderer } = this.state;
    // Note: Since react setState is asynchronous, cube may not necessarily be defined. We run this
    // check to make sure
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer?.render(scene!, camera!);
    }
  }

  setInitialPosition() {
    this.socket?.emit('ReceivePosition', { 
      x: this.cube?.position.x, 
      y: this.cube?.position.y
    }, this.color);
  }

  setupSocket() {
    const socket = socketIOClient('http://127.0.0.1:3000');
    this.socket = socket;

    this.setInitialPosition();
    socket.on('RetryPosition', () => this.setInitialPosition());
    socket.on('NewPerson', (data: { x: number, y: number, color: number }) => {
      console.log('new person received');
      const { x, y, color } = data;
      const geometry = new BoxGeometry(100, 100, 100);
      const material = new MeshBasicMaterial({ color });
      const cube = new Mesh(geometry, material);
      cube.position.x = x;
      cube.position.y = y;
      this.scene?.add(cube);
    });

    this.setState({ ...this.state, socket });
  }

  componentDidMount() {
    this.init();
    this.setupSocket();
  }

  render() {
    return (<div id="game-window"></div>);
  }
}