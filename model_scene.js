
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Raycaster, Vector3 } from 'three';
import { GridHelper } from 'three';
import { Light } from 'three';
import { Vector2 } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { PMREMGenerator } from 'three';
import { Box3Helper } from 'three';




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#scene")
});
const sceneBox = new THREE.Box3(new Vector3(-2,0,-2),new Vector3(2,4,2))
const control = new OrbitControls(camera, renderer.domElement)
_init()
animate()
const clock = new THREE.Clock();
let mixer;

function _init() {
    //init scene
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // scene.add(new GridHelper())
    scene.background = new THREE.Color(0xbfe3dd);
    // const ambientLight = new THREE.AmbientLight(0xffffff)
    // scene.add(ambientLight)
    camera.position.set(10, 10, 10)
    camera.lookAt(new Vector3(0, 0, 0))
    control.enableDamping = true

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new Box3Helper(sceneBox,new THREE.Color(0xff0000)))

    //load model
    const urlParams = new URLSearchParams(window.location.search);
    const model_url = urlParams.get('model')
    const gltfLoader = new GLTFLoader()
    if (model_url != null) {
        gltfLoader.load(`model/${model_url}.gltf`, (gltf) => {
            let model = gltf.scene

            model.traverse(processNodes)
            
            
            // fit_into_box(sceneBox,model)
            scene.add(model)
            console.log(model)
        }, undefined, (e) => {
            alert(e)
        })

    }
    else {
        gltfLoader.load('model/monkeyHead.gltf', (gltf) => {
            scene.add(gltf.scene)
            console.log(gltf.scene)
            const animations = gltf.animations;
            console.log(animations)
            mixer = new THREE.AnimationMixer( gltf.scene );
            const action=mixer.clipAction(animations[0])
            console.log(mixer)
            
            action.play()
        })
    }

    window.addEventListener('click', onMouseClick, false)
    window.addEventListener('resize', onResize)
}

function processNodes(n) {
    if (n instanceof THREE.Mesh) {
        n.material.side = THREE.FrontSide;
    }
}
function animate() {
    requestAnimationFrame(animate);
    control.update()
    renderer.render(scene, camera);
    // mixer.update(clock.getDelta())
}

function fit_into_box(sceneBounds,model) {
    lengthMeshBounds = new THREE.Box3().setFromObject(model)
    // Calculate side lengths of scene (cube) bounding box
    let lengthSceneBounds = {
        x: Math.abs(sceneBounds.max.x - sceneBounds.min.x),
        y: Math.abs(sceneBounds.max.y - sceneBounds.min.y),
        z: Math.abs(sceneBounds.max.z - sceneBounds.min.z),
    };

    // Calculate side lengths of glb-model bounding box
    let lengthMeshBounds = {
        x: Math.abs(meshBounds.max.x - meshBounds.min.x),
        y: Math.abs(meshBounds.max.y - meshBounds.min.y),
        z: Math.abs(meshBounds.max.z - meshBounds.min.z),
    };

    // Calculate length ratios
    let lengthRatios = [
        (lengthSceneBounds.x / lengthMeshBounds.x),
        (lengthSceneBounds.y / lengthMeshBounds.y),
        (lengthSceneBounds.z / lengthMeshBounds.z),
    ];

    // Select smallest ratio in order to contain the model within the scene
    let minRatio = Math.min(...lengthRatios);

    // If you need some padding on the sides
    let padding = 0;
    minRatio -= padding;

    // Use smallest ratio to scale the model
    model.scale.set(minRatio, minRatio, minRatio);
}


function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseClick(event) {
    const raycast = new Raycaster()
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const mouse = new Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycast.setFromCamera(mouse, camera)
    const intersects = raycast.intersectObjects(scene.children)
    // for (let index = 0; index < intersects.length; index++) {
    //     intersects[index].object.material.color.set(0xff0000)

    // }
    console.log(intersects)

    
}










