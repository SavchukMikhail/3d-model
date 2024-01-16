import { DoubleSide, RawShaderMaterial, Uniform, Vector3, Vector4 } from 'three';

import { muscleFragmentShader, MuscleHighlight, muscleVertexShader } from 'shared';

interface ILightInfo {
  position: Vector3;
  color: Vector3;
  intensity: number;
}

export class MuscleMaterial extends RawShaderMaterial {
  constructor(color: Vector4, lightsInfo: ILightInfo[]) {
    super();

    this.side = DoubleSide;
    this.transparent = true;

    const positions: Vector3[] = [];
    const colors: Vector3[] = [];
    const intensions: number[] = [];

    lightsInfo.forEach((lightInfo) => {
      positions.push(lightInfo.position);
      colors.push(lightInfo.color);
      intensions.push(lightInfo.intensity);
    });

    this.uniforms = {
      color: new Uniform(color),
      shininess: new Uniform(100.0),
      needHighlight: new Uniform(MuscleHighlight.NoHighlight),
      pointLightPosition: new Uniform(positions),
      pointLightColor: new Uniform(colors),
      pointLightIntensity: new Uniform(intensions),
    };

    const lightsCount = lightsInfo.length;

    this.vertexShader = muscleVertexShader(lightsCount);
    this.fragmentShader = muscleFragmentShader(lightsCount);

    this.needsUpdate = true;
  }

  updateHighlight(needHighlight: MuscleHighlight) {
    this.uniforms.needHighlight.value = needHighlight;
    this.needsUpdate = true;
  }
}
