import * as BABYLON from 'babylonjs'
// import { Timeline } from './managers/Timeline'
// import animationJSON from './animations/animation-test.json'
import particleSystemJSON from './particle_systems/particleSystem.json'

const DEBUG_MODE = false

let canvas = document.createElement('canvas')
document.body.appendChild(canvas)

canvas.style.width = '100vw'
canvas.style.height = '100vh'

let style = document.createElement('style')
style.innerHTML = `
.hide-cursor {
  cursor: none
}
`
document.head.appendChild(style)

let engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true}, true)
let inputVector = new BABYLON.Vector3(0, 0, 0)
let inputObject = {
  left: false,
  right: false,
  top: false,
  bottom: false,
  shift: false,
  space: false,
}

let createScene = () => {
  // Create a basic BJS Scene object
  let scene = new BABYLON.Scene(engine)
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  let camera = new BABYLON.FollowCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())

  let skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 10000 }, scene);
  let skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('./imgs/skybox/bkg1', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // Attach the camera to the canvas
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  // Create a built-in "sphere" shape its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  let sphere = BABYLON.CreateSphere('sphere1', {
    segments: 16,
    diameter: 2,
    updatable: false,
    sideOrientation: BABYLON.Mesh.FRONTSIDE,
  }, scene)
  // Move the sphere upward 1/2 of its height
  sphere.position.y = 1
  sphere.isVisible = false

  camera.lockedTarget = sphere

  // Create a built-in "ground" shape its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  let ground = BABYLON.CreateGround('ground1', {
    height: 60,
    width: 60,
    subdivisions: 2,
    updatable: false,
  }, scene)
  // Return the created scene
  return scene
}

// call the createScene function
let scene = createScene()
if (DEBUG_MODE) {
  scene.debugLayer.show({
    showExplorer: true,
    showInspector: true,
    overlay: true,
    inspectorURL: './js/inspector.js'
  })
}

let sphere = scene.getMeshByName('sphere1')

// let animation = BABYLON.Animation.Parse(animationJSON.animations[0])
// sphere.animations = [animation]
// scene.beginAnimation(sphere, 0, 100, true)

let particleSystem = BABYLON.GPUParticleSystem.Parse(particleSystemJSON, scene, '.')
particleSystem.start()

// run the render loop
engine.runRenderLoop(function(){
  /* Timeline.update() */

  inputVector.set(0, 0, 0)

  if (inputObject.left) {
    inputVector.x -= 1
  }
  if (inputObject.right) {
    inputVector.x += 1
  }
  if (inputObject.space) {
    inputVector.y += 1
  }
  if (inputObject.shift) {
    inputVector.y -= 1
  }
  if (inputObject.top) {
    inputVector.z -= 1
  }
  if (inputObject.bottom) {
    inputVector.z += 1
  }

  let speed = 0.00002 * engine.getDeltaTime() * 1000/*  Timeline.delta */

  inputVector.normalize()

  let velocityVector = inputVector.multiplyByFloats(speed, speed, speed)

  sphere.position = sphere.position.add(velocityVector)
  scene.render()
})

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  engine.resize()
})

window.addEventListener('keydown', e => {
  if (e.code == 'KeyA') {
    inputObject.left = true
  } else if (e.code == 'KeyD') {
    inputObject.right = true
  } else if (e.code == 'KeyW') {
    inputObject.top = true
  } else if (e.code == 'KeyS') {
    inputObject.bottom = true
  } else if (e.code == 'ShiftLeft') {
    inputObject.shift = true
  } else if (e.code == 'Space') {
    inputObject.space = true
  }
})

window.addEventListener('keyup', e => {
  if (e.code == 'KeyA') {
    inputObject.left = false
  } else if (e.code == 'KeyD') {
    inputObject.right = false
  } else if (e.code == 'KeyW') {
    inputObject.top = false
  } else if (e.code == 'KeyS') {
    inputObject.bottom = false
  } else if (e.code == 'ShiftLeft') {
    inputObject.shift = false
  } else if (e.code == 'Space') {
    inputObject.space = false
  }
})

if (!DEBUG_MODE) {
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId)
  
    canvas.classList.add('hide-cursor')
  
    const onPointerMove = (e: PointerEvent) => {
      sphere.rotate(new BABYLON.Vector3(0, 0, 1), e.movementX * Math.PI * 0.01)
    }
  
    const onPointerUp = (e: PointerEvent) => {
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.releasePointerCapture(e.pointerId)
      canvas.classList.remove('hide-cursor')
    }
  
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
  })
}
