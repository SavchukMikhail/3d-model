import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const sceneData=Object.create({
    model:'/models/hand.glb',
});

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/js/libs/draco-new/'); // use a full url path
loader.setDRACOLoader(dracoLoader);
loader.load(
    sceneData.model,
    gltf=>{
        const sceneGlb=gltf.scene;
        sceneGlb.scale.set(.05,.05,.05)

        // Add volumetric light
        const cylForLight=new THREE.CylinderGeometry( .01, 2.7, 10, 64, 80, true);
        scene.add(sceneGlb)

        

        sceneGlb.rotation.set(-.21,0,0);
        sceneGlb.position.set(0,-.49,0);
        //Изменить цвет модели
        for(const el in sceneGlb.children[0].children){
            // sceneGlb.children[0].children[el].receiveShadow=true
            //sceneGlb.children[0].children[el].castShadow=true;
            const mesh = sceneGlb.children[0].children[el];
            //console.log(mesh);
            mesh.material.color=new THREE.Color(0x1c1810)
            console.log('вижу');
            if(mesh.name==='biceps'){
                console.log('biceps');
                mesh.material.color=new THREE.Color(0x1c1810)
                mesh.material.roughness=.4
                mesh.material.metalness=.5
                // HDR map
                mesh.material.envMapIntensity=.8
                mesh.material.envMap = hdrEquirect
                // \ HDR map

            }
            /*
            New_object_1-5
            New_object_1 — main helmet
            New_object_2 — что-то на ушах (где и накладки)
            New_object_3 — накладки на ушах
            New_object_4 — unknown
            New_object_5 — glass
             */
            //console.log(mesh.name); // what is it?
        
        }
        
    }
)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.setx = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight) 



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    //const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()