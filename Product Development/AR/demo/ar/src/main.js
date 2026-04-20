import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create a camera (perspective projection)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 200; // Position the camera back a bit so the model is in view

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Append the renderer to the DOM

// Add some lighting (directional light)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Create a loader to load the GLTF model
const loader = new GLTFLoader();

// Load the GLTF model
loader.load(
  "/src/assets/final_setup.glb", // Path to your GLTF file
  function (gltf) {
    scene.add(gltf.scene); // Add the loaded model to the scene
  },
  undefined,
  function (error) {
    console.error(error); // Log any error that occurs
  }
);

// Create an animation/render loop
function animate() {
  requestAnimationFrame(animate); // Call animate recursively for smooth animation

  // Optionally, you can rotate the object or do any other animations here
  scene.traverse((child) => {
    if (child.isMesh) {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
    }
  });

  renderer.render(scene, camera); // Render the scene with the camera
}

animate(); // Start the animation loop
