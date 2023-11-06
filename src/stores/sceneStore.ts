import { makeAutoObservable } from 'mobx';
import {
  Box3,
  Color,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { SceneUtils } from 'shared';
import { ISceneStore } from 'shared/interfaces';
import { HandProcessingModel } from 'shared/models';

const isDebug = true;

const stats = new Stats();

isDebug && document.body.appendChild(stats.dom);

class SceneStore implements ISceneStore {
  public mainCanvas: HTMLCanvasElement;
  public context: WebGLRenderingContext;

  public controls: OrbitControls;

  public scene = new Scene();
  public camera: PerspectiveCamera = new PerspectiveCamera();

  private readonly renderer: WebGLRenderer;
  private effectComposer: EffectComposer;
  public outlinePass: OutlinePass | null = null;

  private handModel: HandProcessingModel | null = null;

  private lights: PointLight[] = [];

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
    this.renderer.shadowMap.enabled = true;

    this.effectComposer = new EffectComposer(this.renderer);
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
    if (this.handModel) return;

    this.handModel = new HandProcessingModel(this);
    this.handModel.init(this.lights);
  }

  public initLight() {
    const firstPointLight = new PointLight(0xfafafa, 500);
    firstPointLight.position.set(15, 2, 25);

    this.scene.add(firstPointLight);
    this.lights.push(firstPointLight);

    const secondPointLight = new PointLight().copy(firstPointLight);
    secondPointLight.position.set(-10, -5, -25);

    this.scene.add(secondPointLight);
    this.lights.push(secondPointLight);

    const thirdPointLight = new PointLight().copy(firstPointLight);
    thirdPointLight.position.set(30, 20, -10);

    this.scene.add(thirdPointLight);
    this.lights.push(thirdPointLight);
  }

  private render() {
    requestAnimationFrame(this.render.bind(this));

    isDebug && stats.begin();

    this.controls.update();

    this.effectComposer.render();

    isDebug && stats.end();
  }

  public updateSceneSizes(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(width, height);
    this.effectComposer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public initScene(wrapper: HTMLDivElement) {
    wrapper.prepend(this.mainCanvas);

    this.updateSceneSizes(wrapper.clientWidth, wrapper.clientHeight);

    this.camera.position.z = 5;
    this.controls.update();

    this.initLight();

    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);

    this.outlinePass = new OutlinePass(
      new Vector2(wrapper.clientWidth, wrapper.clientHeight),
      this.scene,
      this.camera,
    );
    this.outlinePass.visibleEdgeColor = new Color(0.7, 0.7, 0.7);
    this.outlinePass.hiddenEdgeColor = new Color(0.15, 0.15, 0.15);
    this.effectComposer.addPass(this.outlinePass);

    (window as any).scene = this.scene;

    this.render();
  }

  public checkIntersection(mousePosition: Vector2) {
    if (!this.outlinePass) return;

    SceneUtils.raycaster.setFromCamera(mousePosition, this.camera);

    const intersects = SceneUtils.raycaster.intersectObject(this.scene);

    this.handModel?.updateModelByIntersections(intersects);
  }

  public deInit() {
    this.scene.clear();
  }
}

export default new SceneStore();
