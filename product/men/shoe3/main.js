import { loadGLTF } from "../../libs/loader.js"; 
const THREE = window.MINDAR.IMAGE.THREE; 

document.addEventListener('DOMContentLoaded', () => { 
const start = async () => { 
// Create a new MindARThree instance and configure it 
const mindarThree = new window.MINDAR.IMAGE.MindARThree({ 
container: document.body, 
imageTargetSrc: '../../assets/targets/men/men3.mind' 
}); 

// Extract the renderer, scene, and camera from the MindARThree instance 
const { renderer, scene, camera } = mindarThree; 

// Add a hemisphere light to illuminate the AR scene 
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1); 
scene.add(light);

// Load a 3D model (raccoon) using the loadGLTF func on and configure its scale and position 
const raccoon = await loadGLTF('../../assets/models/men3/scene.gltf'); 
raccoon.scene.scale.set(0.6, 0.6, 0.6); 
raccoon.scene.position.set(0, 0, 0); 

// Add an AR anchor for the raccoon and atach the raccoon model to it 
const raccoonAnchor = mindarThree.addAnchor(0); 
raccoonAnchor.group.add(raccoon.scene); 

// Start the MindARThree AR experience 
await mindarThree.start(); 

// Set up a rendering loop using the Three.js renderer to con nuously render the AR scene 
renderer.setAnimationLoop(() => { 
renderer.render(scene, camera); 
}); 
} 

// Call the start func on to begin the AR experience when the DOM content is loaded 
start(); 
});