const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    try {
      // Create a new MindARThree instance and configure it
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.body,
        imageTargetSrc: 'assets/targets/about/about.mind'
      });

      // Extract the renderer, scene, and camera from the MindARThree instance
      const { renderer, scene, camera } = mindarThree;

      // Add a hemisphere light to illuminate the AR scene
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Create a texture loader
      const textureLoader = new THREE.TextureLoader();

      // Load the image textures
      const textures = [
        textureLoader.load('assets/images/pic1.png'),
        textureLoader.load('assets/images/pic2.png'),
        textureLoader.load('assets/images/pic3.png'),
        textureLoader.load('assets/images/pic4.png'),
        textureLoader.load('assets/images/pic5.png'),
        textureLoader.load('assets/images/pic6.png'),
      ];

      // Create a plane geometry to display the image
      const geometry = new THREE.PlaneGeometry(1, 1);

      // Create a material with the first image texture
      let material = new THREE.MeshBasicMaterial({ map: textures[0] });

      // Create a mesh with the geometry and material
      const picture = new THREE.Mesh(geometry, material);
      picture.position.set(0, 0, 0);

      // Add an AR anchor for the picture and attach the picture mesh to it
      const pictureAnchor = mindarThree.addAnchor(0);
      pictureAnchor.group.add(picture);

      // Variable to track the current texture index
      let currentTextureIndex = 0;

      // Create a raycaster and mouse vector for click detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Function to handle click events
      const onClick = (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the picture mesh
        const intersects = raycaster.intersectObject(picture);

        if (intersects.length > 0) {
          // Cycle to the next texture on click
          currentTextureIndex = (currentTextureIndex + 1) % textures.length;
          material.map = textures[currentTextureIndex];
          material.needsUpdate = true; // Inform Three.js to update the material
        }
      };

      // Add the event listener for mouse clicks
      window.addEventListener('click', onClick, false);

      // Start the MindARThree AR experience
      await mindarThree.start();

      // Set up a rendering loop using the Three.js renderer to continuously render the AR scene
      renderer.setAnimationLoop(() => {
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
