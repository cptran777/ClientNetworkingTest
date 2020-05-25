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
  }

  init() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 600 / 500, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(600, 500);

    const element = document.getElementById('game-window');
    element?.appendChild(renderer.domElement);

    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshBasicMaterial({ color: 0x81d2ff });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 1000;
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

  setupSocket() {
    const socket = socketIOClient('http://127.0.0.1:3000');
    socket.on('Hello darkness my old friend', (data: unknown) => {
      console.log('we have data');
      console.log(data);
    });

    socket.on('Interval', (data: unknown) => {
      console.log('we have interval data');
      console.log(data);
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