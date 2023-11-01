import { makeAutoObservable } from 'mobx';
import {
  AmbientLight,
  Box3,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelUrl = '/models/hand.glb';

class SceneStore {
  public mainCanvas: HTMLCanvasElement;
  public context: WebGLRenderingContext;

  public controls: OrbitControls;

  public scene = new Scene();
  public camera: PerspectiveCamera = new PerspectiveCamera();
  public renderer: WebGLRenderer = new WebGLRenderer();

  private isModelLoaded = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    const canvas = document.createElement('canvas');

    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '0';

    this.mainCanvas = canvas;
    this.context = this.mainCanvas.getContext('webgl2') || new WebGLRenderingContext();

    this.controls = new OrbitControls(this.camera, canvas);
    this.renderer = new WebGLRenderer({ canvas: this.mainCanvas, context: this.context });
  }

  public zoomTo(bb: Box3, zoomFactor = 1) {
    const boxSize = bb.getSize(new Vector3());

    const maxDimension = Math.max(boxSize.x, boxSize.y, boxSize.z);

    this.camera.position.set(
      -maxDimension * zoomFactor,
      maxDimension * zoomFactor,
      maxDimension * zoomFactor,
    );
    this.camera.rotation.set(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
  }

  public initModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('/js/libs/draco-new/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(modelUrl, (gltf) => {
      if (this.isModelLoaded) return;

      const modelData = gltf.scene;

      this.scene.add(modelData);
      this.isModelLoaded = true;
      const bb = new Box3();

      for (const mesh of modelData.children) {
        bb.expandByObject(mesh);

        if (mesh.name === 'skeleton') continue;

        const currentMesh = mesh as Mesh;

        if (currentMesh.name === 'biceps') {
          currentMesh.material = new MeshPhysicalMaterial({
            color: 0x00ff00,
            reflectivity: 0.5,
            roughness: 0.4,
          });
        } else {
          (currentMesh.material as any).color = new Color(
            Math.random(),
            Math.random(),
            Math.random(),
          );
        }
      }

      this.zoomTo(bb);
    });
  }

  public initLight() {
    const ambientLight = new AmbientLight(0xf0f0f0); // soft white light
    this.scene.add(ambientLight);
  }

  private render() {
    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  public updateSceneSizes(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public initScene(wrapper: HTMLDivElement) {
    wrapper.prepend(this.mainCanvas);

    this.updateSceneSizes(wrapper.clientWidth, wrapper.clientHeight);

    this.camera.position.z = 5;
    this.controls.update();

    this.initLight();

    (window as any).scene = this.scene;
    const light = new AmbientLight(0x404040); // soft white light
    this.scene.add(light);

    this.render();
  }

  public deInit() {
    this.scene.clear();
  }
}

export default new SceneStore();
