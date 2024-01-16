import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui";

const renderer=new Three.WebGLRenderer();

renderer.shadowMap.enabled=true;
renderer.setSize(window.innerWidth,window.innerHeight);


document.body.appendChild(renderer.domElement);

const scene=new Three.Scene()
const camera =new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);


const orbit=new OrbitControls(camera,renderer.domElement);
const axesHelper=new Three.AxesHelper(5);
scene.add(axesHelper)
camera.position.set(0,0,5);


const BoxGeometry=new Three.BoxGeometry(2.5,2.5,2.5);
const BoxMaterial=new Three.MeshBasicMaterial({color:0xFFB996});
const box=new Three.Mesh(BoxGeometry,BoxMaterial);
scene.add(box);

const planeGeometry=new Three.PlaneGeometry(30,30);
const planeMaterial = new Three.MeshStandardMaterial({color:0xFFfFFf});
const plane=new Three.Mesh(planeGeometry,planeMaterial);
plane.rotation.x=-0.5*Math.PI;

scene.add(plane)
plane.receiveShadow=true;

const sphereGeometry=new Three.SphereGeometry(4,32,32);
const sphereMaterial=new Three.MeshStandardMaterial({color:0x0000FF,wireframe:false});
const sphere=new Three.Mesh(sphereGeometry,sphereMaterial);
sphere.position.x=-7

scene.add(sphere);
sphere.castShadow=true;
const gridHelper=new Three.GridHelper(30);
scene.add(gridHelper);

//light
const ambient=new Three.AmbientLight(0xFFfFFf);

scene.add(ambient);

const direction=new Three.DirectionalLight(0xFFfFFf);
direction.position.set(-30,50,0)
direction.castShadow=true;
direction.shadow.camera.bottom=-12
scene.add(direction);
const dirHelper=new Three.DirectionalLightHelper(direction)
scene.add(dirHelper);

const DLshadowHelper=new Three.CameraHelper(direction.shadow.camera)
scene.add(DLshadowHelper);

const spotLight=new Three.SpotLight();
scene.add(spotLight);
spotLight.position.set(-100,100,0);
const spotHelper=new Three.SpotLightHelper(spotLight);
scene.add(spotHelper)

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe:false,
  speed:0
};
gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options,"wireframe").onChange(function(e){
    sphere.material.wireframe=e
})

gui.add(options,"speed",0,0.1);

let step=0;


function animation(time){
    box.rotation.x=time/1000;
    box.rotation.y=time/1000;
    step +=options.speed;
    sphere.position.y=Math.abs(Math.sin(step))*10;
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animation);

