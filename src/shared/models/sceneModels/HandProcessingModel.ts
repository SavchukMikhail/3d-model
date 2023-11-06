import { makeAutoObservable } from 'mobx';
import {
  Box3,
  Color,
  Intersection,
  Mesh,
  MeshPhysicalMaterial,
  PointLight,
  Vector3,
  Vector4,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { HandModelMeshNames, MuscleHighlight } from 'shared/enums';
import { ISceneStore } from 'shared/interfaces';
import { MuscleMaterial } from 'shared/materials';
import { ColorUtils } from 'shared/utils';

const modelUrl = '/models/hand.glb';

export class HandProcessingModel {
  private sceneStore: ISceneStore;

  private modelStructures: Record<string, Mesh> = {};

  constructor(sceneStore: ISceneStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.sceneStore = sceneStore;
  }

  public init(lights: PointLight[]) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('/js/libs/draco-new/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(modelUrl, (gltf) => {
      const modelData = gltf.scene;

      this.sceneStore.scene.add(modelData);
      const bb = new Box3();

      const lightsInfo = lights.map((light) => ({
        position: light.position.clone(),
        color: new Vector3(light.color.r, light.color.g, light.color.b),
        intensity: light.intensity,
      }));

      for (const mesh of modelData.children) {
        bb.expandByObject(mesh);

        const currentMesh = mesh as Mesh;

        if (currentMesh.name === HandModelMeshNames.Skeleton) {
          currentMesh.material = new MeshPhysicalMaterial({
            color: new Color(0.89, 0.85, 0.79),
            reflectivity: 0.5,
            roughness: 0.4,
          });

          continue;
        }

        const randomColor = ColorUtils.getRandomColorExcludingBlue();
        currentMesh.material = new MuscleMaterial(
          new Vector4(randomColor[0], randomColor[1], randomColor[2], 1.0),
          lightsInfo,
        );

        this.modelStructures[currentMesh.name] = currentMesh;
      }

      this.sceneStore.zoomTo(bb);
    });
  }

  private clearPrevSelectedObjectHighlight() {
    if (this.sceneStore.outlinePass && this.sceneStore.outlinePass.selectedObjects.length) {
      const object = this.sceneStore.outlinePass.selectedObjects[0] as Mesh;
      const material = object.material as MuscleMaterial;

      if (object.name !== HandModelMeshNames.Skeleton)
        material.updateHighlight(MuscleHighlight.NoHighlight);
    }
  }

  updateModelByIntersections(intersects: Intersection[]) {
    if (!this.sceneStore.outlinePass) return;

    if (intersects.length > 0) {
      this.clearPrevSelectedObjectHighlight();

      const selectedObject = intersects[0].object as Mesh;

      const material = selectedObject.material as MuscleMaterial;
      if (selectedObject.name !== HandModelMeshNames.Skeleton)
        material.updateHighlight(MuscleHighlight.HasHighlight);

      this.sceneStore.outlinePass.selectedObjects = [selectedObject];
    } else {
      this.clearPrevSelectedObjectHighlight();

      this.sceneStore.outlinePass.selectedObjects = [];
    }
  }
}
