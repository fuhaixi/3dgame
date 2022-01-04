
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { Raycaster, Vector3 } from 'three';
import { GridHelper } from 'three';
import { Light } from 'three';
import { Vector2 } from 'three';





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas:document.querySelector("#scene")
});
const control = new OrbitControls(camera,renderer.domElement)
_init()
animate()



function _init(){
    //init scene
    renderer.setSize( window.innerWidth, window.innerHeight );
    scene.add(new GridHelper())
    scene.background =new THREE.Color(0xffffff)
    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    // //load model
    // const urlParams = new URLSearchParams(window.location.search);
    // const model_url =urlParams.get('model')
    // const gltfLoader = new GLTFLoader()
    // if(model_url != null){
    //     gltfLoader.load(`model/${model_url}.gltf`,(gltf)=>{
    //         scene.add(gltf.scene)
    //         console.log(gltf.scene)
    //     },undefined,(e)=>{
    //         alert(e)
    //     })

    // }
    // else{
    //     gltfLoader.load('model/monkeyHead.gltf',(gltf)=>{
    //         scene.add(gltf.scene)
    //         console.log(gltf.scene)
    //     })
    // }

    // window.addEventListener('click',onMouseClick,false)
}

function animate(){
    requestAnimationFrame( animate );
    control.update()
    renderer.render( scene, camera );
   
}


function onMouseClick( event ) {
    const raycast = new Raycaster()
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    const mouse = new Vector2()
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycast.setFromCamera(mouse,camera)
    const intersects = raycast.intersectObjects(scene.children)
    // for (let index = 0; index < intersects.length; index++) {
    //     intersects[index].object.material.color.set(0xff0000)
        
    // }
    console.log(intersects)
}










