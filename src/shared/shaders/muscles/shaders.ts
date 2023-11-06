export const muscleVertexShader = `
    attribute vec3 position;
    attribute vec3 normal;

    uniform vec4 color;
    uniform float needHighlight;
    uniform float pointLightIntensity[3];
    uniform vec3 pointLightPosition[3];
    uniform vec3 pointLightColor[3];

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vLightDir[3]; // Массив для направлений от источников света
    varying vec3 vLightColor[3]; // Массив для цветов и интенсивности света
    varying float vIntensity[3]; // Массив для интенсивности источников света
    varying float vDistance[3]; // Массив для расстояния от источников света

    void main() {
        vColor = float(needHighlight) == 1.0 ? vec4(0.2, 0.3, 1.0, 1.0) : color;
        vPosition = vec3(modelViewMatrix);
        vNormal = normalize(normalMatrix * normal);

        for (int i = 0; i < 3; i++) {
                vLightDir[i] = normalize(pointLightPosition[i] - vPosition);
                vLightColor[i] = pointLightColor[i];
                vIntensity[i] = pointLightIntensity[i];
                vDistance[i] = distance(pointLightPosition[i], vPosition);
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const muscleFragmentShader = `
    precision highp float;

    uniform vec3 ambientColor;
    uniform float shininess;

    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vLightDir[3];
    varying vec3 vLightColor[3];
    varying float vIntensity[3];
    varying float vDistance[3];

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(-vPosition);
        vec3 resultColor = vec3(0.0);

        for (int i = 0; i < 3; i++) {
                vec3 lightDir = normalize(vLightDir[i]);
                float diff = max(dot(normal, lightDir), 0.0);
                vec3 diffuse = diff * vLightColor[i] * vIntensity[i] / (vDistance[i] * vDistance[i]);
                vec3 reflectDir = reflect(-lightDir, normal);
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
                vec3 specular = spec * vLightColor[i] * vIntensity[i] / (vDistance[i] * vDistance[i]);
                resultColor += (ambientColor + diffuse + specular) * vColor.rgb;
        }

        gl_FragColor = vec4(resultColor, vColor.a);
    }
`;
