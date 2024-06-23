import { loadGLTF, loadAudio } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    try {
      // Create a new MindARThree instance and configure it
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.body,
        imageTargetSrc: 'assets/targets/men/men1.mind'
      });

      // Extract the renderer, scene, and camera from the MindARThree instance
      const { renderer, scene, camera } = mindarThree;

      // Add a hemisphere light to illuminate the AR scene
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load a 3D model (men1) using the loadGLTF function and configure its scale and position
      let men1;
      try {
        men1 = await loadGLTF('assets/models/men1/scene.gltf');
      } catch (error) {
        console.error('Error loading 3D model:', error);
        throw error; // Rethrow to be caught by the outer try-catch
      }
      men1.scene.scale.set(0.1, 0.1, 0.1);
      men1.scene.position.set(0, -0.4, 0);

      // Add an AR anchor for the men1 and attach the men1 model to it
      const men1Anchor = mindarThree.addAnchor(0);
      men1Anchor.group.add(men1.scene);

      // Load an audio clip (background music) using the loadAudio function
      let audioClip;
      try {
        audioClip = await loadAudio('assets/sounds/shoe1.mp3');
      } catch (error) {
        console.error('Error loading audio clip:', error);
        throw error; // Rethrow to be caught by the outer try-catch
      }

      // Create an audio listener and attach it to the camera
      const listener = new THREE.AudioListener();
      camera.add(listener);

      // Create a positional audio source and attach it to the AR anchor's group
      const audio = new THREE.PositionalAudio(listener);
      men1Anchor.group.add(audio);

      // Set the audio buffer to the loaded audio clip, configure audio properties
      audio.setBuffer(audioClip);
      audio.setRefDistance(100); // Reference distance for audio falloff
      audio.setLoop(true); // Loop the audio

      // Define actions to play and pause audio when the target is found or lost
      men1Anchor.onTargetFound = () => {
        audio.play();
      };
      men1Anchor.onTargetLost = () => {
        audio.pause();
      };

      // Start the MindARThree AR experience
      try {
        await mindarThree.start();
      } catch (error) {
        console.error('Error starting MindARThree:', error);
        throw error; // Rethrow to be caught by the outer try-catch
      }

      // Set up a rendering loop using the Three.js renderer to continuously render the AR scene
      renderer.setAnimationLoop(() => {
        // Rotate the model around its vertical axis (Y-axis)
        men1.scene.rotation.y += 0.01;

        // Render the scene
        renderer.render(scene, camera);
      });
    } catch (error) {
      console.error('Error starting AR experience:', error);
    }
  };

  // Call the start function to begin the AR experience when the DOM content is loaded
  start();
});
