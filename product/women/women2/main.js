import { loadGLTF, loadAudio } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Create a new MindARThree instance and configure it
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: 'assets/targets/women/women2.mind'
    });

    // Extract the renderer, scene, and camera from the MindARThree instance
    const { renderer, scene, camera } = mindarThree;

    // Add a hemisphere light to illuminate the AR scene
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load a 3D model (women2) using the loadGLTF function and configure its scale and position
    const women2 = await loadGLTF('assets/models/women2/scene.gltf');
    women2.scene.scale.set(0.5 , 0.5, 0.5);
    women2.scene.position.set(0, -0.4, 0);

    // Add an AR anchor for the women2 and attach the women2 model to it
    const women2Anchor = mindarThree.addAnchor(0);
    women2Anchor.group.add(women2.scene);

    // Load an audio clip (background music) using the loadAudio function
    const audioClip = await loadAudio('assets/sounds/women2.mp3');

    // Create an audio listener and attach it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create a positional audio source and attach it to the AR anchor's group
    const audio = new THREE.PositionalAudio(listener);
    women2Anchor.group.add(audio);

    // Set the audio buffer to the loaded audio clip, configure audio properties
    audio.setBuffer(audioClip);
    audio.setRefDistance(100); // Reference distance for audio falloff
    audio.setLoop(true); // Loop the audio

    // Define actions to play and pause audio when the target is found or lost
    women2Anchor.onTargetFound = () => {
      audio.play();
    };
    women2Anchor.onTargetLost = () => {
      audio.pause();
    };

    // Start the MindARThree AR experience
    await mindarThree.start();

    // Set up a rendering loop using the Three.js renderer to continuously render the AR scene
    renderer.setAnimationLoop(() => {
      // Rotate the model around its vertical axis (Y-axis)
      women2.scene.rotation.y += 0.01; // Adjust the rotation speed as desired

      // Render the scene
      renderer.render(scene, camera);
    });
  };

  // Call the start function to begin the AR experience when the DOM content is loaded
  start();
});
