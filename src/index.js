// import { mediaCollection } from './product-media-viewer/index.js'
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'
import pairCollection from './product-media-viewer/index.js'
import ActionControlClass from './product-media-viewer/actionControl.js'



/////////////////////////////////////////////////////////////////////
//////////////////// THREEJS SCENE PREP STARTS //////////////////////
/////////////////////////////////////////////////////////////////////



let camera, controls, scene, renderer;

const init = () => {
    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);



    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);

    // controls
    controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.maxPolarAngle = Math.PI / 2;


    // Sphere
    const geometry = new THREE.BoxGeometry(50, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    // window resize event
    window.addEventListener('resize', onWindowResize);
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

const render = () => {
    renderer.render(scene, camera);
}

init();
render();
animate();



/////////////////////////////////////////////////////////////////////
//////////////////// THREEJS SCENE PREP ends ////////////////////////
/////////////////////////////////////////////////////////////////////

const mediaCollection = new pairCollection;
// imageContainer(mediaCollection);

const actionControls = new ActionControlClass;


const dropArea = document.querySelector(".drag-area");
const input = dropArea.querySelector("input");

input.addEventListener("change", function () {
    actionControls.file = input.files;
    actionControls.addFile(mediaCollection);
});

dropArea.addEventListener("dragover", (event) => {
    dropArea.style.opacity = 1
    event.preventDefault();
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    actionControls.file = event.dataTransfer.files;
    actionControls.addFile(mediaCollection);
    dropArea.style.opacity = 0

});



/////////////////////////////////////////////////////////////////////
//////////////////// BUTTONS ACTIVITIES START ///////////////////////
/////////////////////////////////////////////////////////////////////


// view button event listener
document.querySelector('#viewBtn').addEventListener('click', () => (actionControls.viewBtn(mediaCollection, camera, controls)));

// set button event listener
document.querySelector('#setBtn').addEventListener('click', () => {actionControls.setBtn(mediaCollection, camera)});

// next image button event listener
document.querySelector('#rightBtn').addEventListener('click', () => {actionControls.nextImage(mediaCollection)});

// prev image button listener
document.querySelector('#leftBtn').addEventListener('click', () => {actionControls.prevImage(mediaCollection)});





// () => {
//     ActionControlClass.setBtn(mediaCollection, camera)
// }


/////////////////////////////////////////////////////////////////////
//////////////////// BUTTONS ACTIVITIES ENDS  ///////////////////////
/////////////////////////////////////////////////////////////////////
