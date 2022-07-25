import * as BABYLON from 'babylonjs';

let canvas = document.createElement('canvas')
document.body.appendChild(canvas);

canvas.style.width = '100vw';
canvas.style.height = '100vh';

let engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true}, true);

let createScene = () => {
  // Create a basic BJS Scene object
  let scene = new BABYLON.Scene(engine);
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  // Attach the camera to the canvas
  camera.attachControl(canvas, false);
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  // let sphere = BABYLON.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  let sphere = BABYLON.CreateSphere('sphere1', {
    segments: 16,
    diameter: 2,
    updatable: false,
    sideOrientation: BABYLON.Mesh.FRONTSIDE,
  }, scene);
  // Move the sphere upward 1/2 of its height
  sphere.position.y = 1;
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  let ground = BABYLON.CreateGround('ground1', {
    height: 6,
    width: 6,
    subdivisions: 2,
    updatable: false,
  }, scene);
  // Return the created scene
  return scene;
}

// call the createScene function
let scene = createScene();

// run the render loop
engine.runRenderLoop(function(){
  scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', function(){
  engine.resize();
});
