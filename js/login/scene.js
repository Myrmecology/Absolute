/* ============================================================
   ABSOLUTE — js/login/scene.js
   Babylon.js 3D Login Scene | Irregular Geometry | Pulsating
   Rotating Objects | Mirror Floor | Post Processing
   ============================================================ */

const AbsoluteScene = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let engine   = null;
  let scene    = null;
  let camera   = null;
  let meshes   = [];
  let lights   = [];
  let isReady  = false;

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    const canvas = document.getElementById('babylon-canvas');
    if (!canvas || !window.BABYLON) return;

    engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true
    });

    scene = createScene(canvas);

    engine.runRenderLoop(() => {
      if (scene) scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });

    isReady = true;
  }

  // ----------------------------------------------------------
  // CREATE SCENE
  // ----------------------------------------------------------
  function createScene(canvas) {
    const s = new BABYLON.Scene(engine);

    // Transparent background — CSS handles the void gradient
    s.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // Fog for depth
    s.fogMode    = BABYLON.Scene.FOGMODE_EXP2;
    s.fogDensity = 0.018;
    s.fogColor   = new BABYLON.Color3(0, 0, 0.06);

    // Camera
    camera = new BABYLON.ArcRotateCamera(
      'cam',
      Math.PI / 4,
      Math.PI / 3,
      22,
      BABYLON.Vector3.Zero(),
      s
    );
    camera.lowerRadiusLimit  = 18;
    camera.upperRadiusLimit  = 28;
    camera.lowerBetaLimit    = 0.8;
    camera.upperBetaLimit    = 1.4;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.1;

    // Lights
    createLights(s);

    // Geometry
    createIrregularObjects(s);

    // Mirror floor
    createMirrorFloor(s);

    // Particle systems
    createParticles(s);

    // Post processing
    createPostProcessing(s, camera);

    // Slow camera drift
    s.registerBeforeRender(() => {
      animateObjects(s);
    });

    return s;
  }

  // ----------------------------------------------------------
  // LIGHTS
  // ----------------------------------------------------------
  function createLights(s) {

    // Ambient
    const ambient = new BABYLON.HemisphericLight(
      'ambient',
      new BABYLON.Vector3(0, 1, 0),
      s
    );
    ambient.intensity   = 0.15;
    ambient.diffuse     = new BABYLON.Color3(0.1, 0.1, 0.3);
    ambient.groundColor = new BABYLON.Color3(0, 0, 0.05);

    // Cyan point light
    const cyanLight = new BABYLON.PointLight(
      'cyanLight',
      new BABYLON.Vector3(-6, 4, -4),
      s
    );
    cyanLight.diffuse    = new BABYLON.Color3(0, 0.96, 1);
    cyanLight.specular   = new BABYLON.Color3(0, 0.96, 1);
    cyanLight.intensity  = 1.8;
    cyanLight.range      = 20;
    lights.push(cyanLight);

    // Violet point light
    const violetLight = new BABYLON.PointLight(
      'violetLight',
      new BABYLON.Vector3(6, 2, 4),
      s
    );
    violetLight.diffuse   = new BABYLON.Color3(0.48, 0.18, 1);
    violetLight.specular  = new BABYLON.Color3(0.48, 0.18, 1);
    violetLight.intensity = 1.6;
    violetLight.range     = 18;
    lights.push(violetLight);

    // Magenta accent light
    const magentaLight = new BABYLON.PointLight(
      'magentaLight',
      new BABYLON.Vector3(0, -3, 6),
      s
    );
    magentaLight.diffuse   = new BABYLON.Color3(1, 0.18, 0.97);
    magentaLight.specular  = new BABYLON.Color3(1, 0.18, 0.97);
    magentaLight.intensity = 0.5;
    magentaLight.range     = 14;
    lights.push(magentaLight);

    // Animate lights
    animateLights(s, cyanLight, violetLight, magentaLight);
  }

  function animateLights(s, cyan, violet, magenta) {
    let t = 0;
    s.registerBeforeRender(() => {
      t += 0.008;

      // Cyan light orbits
      cyan.position.x = Math.sin(t * 0.7) * 8;
      cyan.position.z = Math.cos(t * 0.5) * 6;
      cyan.intensity  = 1.8 + Math.sin(t * 1.2) * 0.6;

      // Violet light orbits opposite
      violet.position.x = Math.sin(t * 0.4 + Math.PI) * 7;
      violet.position.z = Math.cos(t * 0.6 + Math.PI) * 8;
      violet.intensity  = 1.6 + Math.cos(t * 0.9) * 0.5;

      // Magenta pulses
      magenta.intensity = 1.0 + Math.sin(t * 2.1) * 0.4;
      magenta.position.y = -3 + Math.sin(t * 0.8) * 2;
    });
  }

  // ----------------------------------------------------------
  // IRREGULAR GEOMETRY OBJECTS
  // ----------------------------------------------------------
  function createIrregularObjects(s) {

    // Material factory
    const makeMat = (name, r, g, b, alpha = 0.85, wire = false) => {
      const mat = new BABYLON.StandardMaterial(name, s);
      mat.emissiveColor  = new BABYLON.Color3(r * 0.4, g * 0.4, b * 0.4);
      mat.diffuseColor   = new BABYLON.Color3(r, g, b);
      mat.specularColor  = new BABYLON.Color3(r * 0.8, g * 0.8, b * 0.8);
      mat.specularPower  = 64;
      mat.wireframe      = wire;
      mat.alpha          = alpha;
      return mat;
    };

    // --- Object 1: Large irregular polyhedron (main centerpiece) ---
    const core = BABYLON.MeshBuilder.CreatePolyhedron('core', {
      type: 3, size: 1.8
    }, s);
    core.position = new BABYLON.Vector3(-1, 0.5, 0);
    core.material = makeMat('coreMat', 0, 0.96, 1, 0.9);
    core._absData = { rotX: 0.003, rotY: 0.007, rotZ: 0.002, pulseSpeed: 0.8, baseScale: 1 };
    meshes.push(core);

    // Wireframe overlay on core
    const coreWire = BABYLON.MeshBuilder.CreatePolyhedron('coreWire', {
      type: 3, size: 1.85
    }, s);
    coreWire.position = core.position.clone();
    coreWire.material = makeMat('coreWireMat', 0, 0.96, 1, 0.3, true);
    coreWire._absData = { rotX: -0.002, rotY: 0.005, rotZ: 0.003, pulseSpeed: 0.8, baseScale: 1 };
    meshes.push(coreWire);

    // --- Object 2: Torus knot ---
    const torus = BABYLON.MeshBuilder.CreateTorusKnot('torus', {
      radius: 1.4, tube: 0.22, radialSegments: 128,
      tubularSegments: 32, p: 3, q: 4
    }, s);
    torus.position = new BABYLON.Vector3(5, -0.5, -3);
    torus.material = makeMat('torusMat', 0.48, 0.18, 1, 0.85);
    torus._absData = { rotX: 0.006, rotY: 0.004, rotZ: 0.008, pulseSpeed: 1.1, baseScale: 1 };
    meshes.push(torus);

    // --- Object 3: Octahedron ---
    const octa = BABYLON.MeshBuilder.CreatePolyhedron('octa', {
      type: 1, size: 1.4
    }, s);
    octa.position = new BABYLON.Vector3(-6, 2, 2);
    octa.material = makeMat('octaMat', 1, 0.18, 0.97, 0.8);
    octa._absData = { rotX: 0.009, rotY: 0.003, rotZ: 0.006, pulseSpeed: 1.4, baseScale: 1 };
    meshes.push(octa);

    // --- Object 4: Icosahedron ---
    const icosa = BABYLON.MeshBuilder.CreatePolyhedron('icosa', {
      type: 4, size: 1.1
    }, s);
    icosa.position = new BABYLON.Vector3(3, 3, 3);
    icosa.material = makeMat('icosaMat', 1, 0.84, 0, 0.75);
    icosa._absData = { rotX: 0.004, rotY: 0.011, rotZ: 0.003, pulseSpeed: 0.6, baseScale: 1 };
    meshes.push(icosa);

    // --- Object 5: Small polyhedra cluster ---
    const clusterPositions = [
      new BABYLON.Vector3(-4, -2, -3),
      new BABYLON.Vector3(7, 1, 1),
      new BABYLON.Vector3(-2, -3, 4),
      new BABYLON.Vector3(4, -2, -5),
      new BABYLON.Vector3(-7, -1, 0),
      new BABYLON.Vector3(2, 4, -4),
    ];
    const clusterColors = [
      [0, 0.96, 1],
      [0.48, 0.18, 1],
      [1, 0.18, 0.97],
      [0, 1, 0.61],
      [1, 0.48, 0],
      [0, 0.96, 1],
    ];
    clusterPositions.forEach((pos, i) => {
      const type = i % 5;
      const size = 0.4 + Math.random() * 0.5;
      const mesh = BABYLON.MeshBuilder.CreatePolyhedron(`cluster_${i}`, {
        type, size
      }, s);
      mesh.position = pos;
      const [r, g, b] = clusterColors[i];
      mesh.material = makeMat(`clusterMat_${i}`, r, g, b, 0.7);
      mesh._absData = {
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        rotZ: (Math.random() - 0.5) * 0.02,
        pulseSpeed: 0.5 + Math.random() * 1.5,
        baseScale: 1,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmp: 0.3 + Math.random() * 0.4
      };
      meshes.push(mesh);
    });

    // --- Object 6: Large outer ring (very faint) ---
    const ring = BABYLON.MeshBuilder.CreateTorus('outerRing', {
      diameter: 14, thickness: 0.06, tessellation: 80
    }, s);
    ring.position = new BABYLON.Vector3(0, 0, 0);
    ring.rotation.x = Math.PI / 3;
    ring.material = makeMat('ringMat', 0, 0.96, 1, 0.15, false);
    ring._absData = { rotX: 0.001, rotY: 0.002, rotZ: 0.001, pulseSpeed: 0.3, baseScale: 1 };
    meshes.push(ring);

    // Second ring
    const ring2 = BABYLON.MeshBuilder.CreateTorus('outerRing2', {
      diameter: 10, thickness: 0.04, tessellation: 64
    }, s);
    ring2.position = new BABYLON.Vector3(0, 0, 0);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    ring2.material = makeMat('ringMat2', 0.48, 0.18, 1, 0.12, false);
    ring2._absData = { rotX: -0.001, rotY: 0.003, rotZ: -0.001, pulseSpeed: 0.4, baseScale: 1 };
    meshes.push(ring2);
  }

  // ----------------------------------------------------------
  // ANIMATE OBJECTS
  // ----------------------------------------------------------
  let animTime = 0;
  function animateObjects(s) {
    animTime += 0.016;

    meshes.forEach((mesh, index) => {
      if (!mesh._absData) return;
      const d = mesh._absData;

      // Rotation
      mesh.rotation.x += d.rotX;
      mesh.rotation.y += d.rotY;
      mesh.rotation.z += d.rotZ;

      // Pulsating scale
      const pulse = 1 + Math.sin(animTime * d.pulseSpeed + index) * 0.06;
      mesh.scaling.setAll(pulse * d.baseScale);

      // Float effect for cluster objects
      if (d.floatOffset !== undefined) {
        mesh.position.y += Math.sin(
          animTime * d.floatSpeed + d.floatOffset
        ) * d.floatAmp * 0.016;
      }
    });
  }

  // ----------------------------------------------------------
  // MIRROR FLOOR
  // ----------------------------------------------------------
  function createMirrorFloor(s) {
    const floor = BABYLON.MeshBuilder.CreateGround('floor', {
      width: 40, height: 40, subdivisions: 2
    }, s);
    floor.position.y = -5;

    const mirrorTexture = new BABYLON.MirrorTexture('mirror', 512, s, true);
    mirrorTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, -5);
    mirrorTexture.renderList  = meshes;
    mirrorTexture.level       = 0.25;
    mirrorTexture.adaptiveBlurKernel = 16;

    const floorMat = new BABYLON.StandardMaterial('floorMat', s);
    floorMat.reflectionTexture = mirrorTexture;
    floorMat.diffuseColor      = new BABYLON.Color3(0, 0, 0.03);
    floorMat.specularColor     = new BABYLON.Color3(0.1, 0.1, 0.2);
    floorMat.alpha             = 0.6;

    floor.material = floorMat;
  }

  // ----------------------------------------------------------
  // PARTICLE SYSTEM — Floating dust/energy
  // ----------------------------------------------------------
  function createParticles(s) {
    const emitter = new BABYLON.Mesh('particleEmitter', s);
    emitter.position = BABYLON.Vector3.Zero();

    const ps = new BABYLON.ParticleSystem('particles', 300, s);
    ps.particleTexture = new BABYLON.Texture(
      'https://assets.babylonjs.com/textures/flare.png', s
    );
    ps.emitter          = emitter;
    ps.minEmitBox       = new BABYLON.Vector3(-10, -5, -10);
    ps.maxEmitBox       = new BABYLON.Vector3(10, 5, 10);
    ps.color1           = new BABYLON.Color4(0, 0.96, 1, 0.6);
    ps.color2           = new BABYLON.Color4(0.48, 0.18, 1, 0.4);
    ps.colorDead        = new BABYLON.Color4(0, 0, 0, 0);
    ps.minSize          = 0.02;
    ps.maxSize          = 0.08;
    ps.minLifeTime      = 3;
    ps.maxLifeTime      = 8;
    ps.emitRate         = 30;
    ps.blendMode        = BABYLON.ParticleSystem.BLENDMODE_ADD;
    ps.gravity          = new BABYLON.Vector3(0, 0.02, 0);
    ps.direction1       = new BABYLON.Vector3(-0.5, 1, -0.5);
    ps.direction2       = new BABYLON.Vector3(0.5, 1, 0.5);
    ps.minAngularSpeed  = 0;
    ps.maxAngularSpeed  = Math.PI;
    ps.minEmitPower     = 0.1;
    ps.maxEmitPower     = 0.4;
    ps.updateSpeed      = 0.01;
    ps.start();
  }

  // ----------------------------------------------------------
  // POST PROCESSING
  // ----------------------------------------------------------
  function createPostProcessing(s, cam) {
    try {
      // Glow layer
      const glow = new BABYLON.GlowLayer('glow', s);
      glow.intensity = 0.8;
      glow.blurKernelSize = 32;

      // Highlight specific meshes
      meshes.forEach(mesh => {
        glow.addIncludedOnlyMesh(mesh);
      });

      // Lens effect pipeline
      const pipeline = new BABYLON.DefaultRenderingPipeline(
        'pipeline', true, s, [cam]
      );
      pipeline.bloomEnabled     = true;
      pipeline.bloomThreshold   = 0.6;
      pipeline.bloomWeight      = 0.4;
      pipeline.bloomKernel      = 64;
      pipeline.bloomScale       = 0.5;
      pipeline.chromaticAberrationEnabled = true;
      pipeline.chromaticAberration.aberrationAmount = 1.5;
      pipeline.grainEnabled     = true;
      pipeline.grain.intensity  = 8;
      pipeline.grain.animated   = true;
      pipeline.vignetteEnabled  = true;
      pipeline.vignette.weight  = 3;
      pipeline.vignette.color   = new BABYLON.Color4(0, 0, 0.05, 0);

    } catch (e) {
      console.warn('[ABSOLUTE] Post processing not fully supported:', e.message);
    }
  }

  // ----------------------------------------------------------
  // DISPOSE
  // ----------------------------------------------------------
  function dispose() {
    if (engine) {
      engine.dispose();
      engine  = null;
      scene   = null;
      meshes  = [];
      isReady = false;
    }
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, dispose };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteScene.init();
});