import { loadGLTF } from "../../libs/loader.js"; 
const THREE = window.MINDAR.IMAGE.THREE; 

document.addEventListener('DOMContentLoaded', () => { 
const start = async () => { 
// Create a new MindARThree instance and configure it 
const mindarThree = new window.MINDAR.IMAGE.MindARThree({ 
container: document.body, 
imageTargetSrc: '../../assets/targets/women/women6.mind' 
}); 

// Extract the renderer, scene, and camera from the MindARThree instance 
const { renderer, scene, camera } = mindarThree; 

// Add a hemisphere light to illuminate the AR scene 
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1); 
scene.add(light);

// Load a 3D model (women6) using the loadGLTF func on and configure its scale and position 
const women6 = await loadGLTF('../../assets/models/women6/scene.gltf'); 
women6.scene.scale.set(4.5, 4.5, 4.5); 
women6.scene.position.set(0, -0.4, 0); 

// Add an AR anchor for the women6 and atach the women6 model to it 
const women6Anchor = mindarThree.addAnchor(0); 
women6Anchor.group.add(women6.scene); 

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