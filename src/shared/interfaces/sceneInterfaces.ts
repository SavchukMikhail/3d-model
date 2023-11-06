import { Box3, PerspectiveCamera, Scene } from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

export interface ISceneStore {
  scene: Scene;
  camera: PerspectiveCamera;
  outlinePass: OutlinePass | null;
  zoomTo(bb: Box3, zoomFactor?: number): void;
}
