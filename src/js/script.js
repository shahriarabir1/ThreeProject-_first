import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui";
import star from "../img/stars.jpg"
import nebula from "../img/nebula.jpg"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
const renderer=new Three.WebGLRenderer();

renderer.shadowMap.enabled=true;
renderer.setSize(window.innerWidth,window.innerHeight);



// set bg color
//renderer.setClearColor(0xFff)

const mouseposition=new Three.Vector2();
window.addEventListener("mousemove",function(e){
  e.preventDefault();
  mouseposition.x=(e.clientX/this.window.innerWidth)*2-1;
  mouseposition.y=(e.clientY/this.window.innerHeight)*2+1;
});
document.body.appendChild(renderer.domElement);

const scene=new Three.Scene()
const camera =new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

//fog with start and end distance
//scene.fog=new Three.Fog(0xffffff,0,20)

//fog with density
//scene.fog=new Three.FogExp2(0xffffff,0.1)

//single bg
const display2=new Three.TextureLoader();
// scene.background=display.load(star);


//multiside bg
const display=new Three.CubeTextureLoader()
scene.background=display.load([star,nebula,nebula,star,nebula,star])

const orbit=new OrbitControls(camera,renderer.domElement);
const axesHelper=new Three.AxesHelper(5);
scene.add(axesHelper)
camera.position.set(0,0,5);


const BoxGeometry=new Three.BoxGeometry(2.5,2.5,2.5);

//one side

// const BoxMaterial=new Three.MeshBasicMaterial({
//   // color:0xFFB996
//   map:display2.load(nebula)
//  });
 


//six side different image
const BoxMaterial=[new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(nebula)
 }),
 new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(nebula)
 }),
 new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(nebula)
 }),
 new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(nebula)
 }),
 new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(star)
 }),
 new Three.MeshBasicMaterial({
  // color:0xFFB996
  map:display2.load(nebula)
 }),

]

const box=new Three.Mesh(BoxGeometry,BoxMaterial);
scene.add(box);

const planeGeometry=new Three.PlaneGeometry(30,30);
const planeMaterial = new Three.MeshStandardMaterial({color:0xFFfFFf});
const plane=new Three.Mesh(planeGeometry,planeMaterial);
plane.rotation.x=-0.5*Math.PI;

scene.add(plane)
plane.receiveShadow=true;

const planeGeometry2=new Three.PlaneGeometry(10,10,10,10)
const planeMaterial2=new Three.MeshStandardMaterial({color:0xffffff,wireframe:true})
const plane2=new Three.Mesh(planeGeometry2,planeMaterial2);
plane2.position.set(5,8,3);
scene.add(plane2);


//change the position of vertex
plane2.geometry.attributes.position.array[0]-=10
plane2.geometry.attributes.position.array[1]-=10
plane2.geometry.attributes.position.array[2]-=10

const sphereGeometry=new Three.SphereGeometry(4,32,32);
const sphereMaterial=new Three.MeshStandardMaterial({color:0x0000FF,wireframe:false});
const sphere=new Three.Mesh(sphereGeometry,sphereMaterial);
sphere.position.x=-7

scene.add(sphere);
sphere.castShadow=true;
const gridHelper=new Three.GridHelper(30);
scene.add(gridHelper);

const sphere2=new Three.SphereGeometry(2);
const VShader=`void main(){
  gl_Position= projectionMatrix * modelViewMatrix * vec4 (position, 1.0);
}`

const fShader=`void main(){
  gl_FragColor=vec4(0.5 , 0.5 , 1.0 , 1.0);
}`

const sphereMat=new Three.ShaderMaterial({
  vertexShader:VShader,
  fragmentShader:fShader
})
const sphere3=new Three.Mesh(sphere2 , sphereMat);
scene.add(sphere3)
sphere3.position.set(5,10,20)
//light
const ambient=new Three.AmbientLight(0xFFfFFf); 

scene.add(ambient);

sphere.name="spehere1"

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

const raycaster=new Three.Raycaster();



function animation(time){
    box.rotation.x=time/1000;
    box.rotation.y=time/1000;
    step +=options.speed;
    sphere.position.y=Math.abs(Math.sin(step))*10;
    raycaster.setFromCamera(mouseposition,camera);
    const intersect=raycaster.intersectObjects(scene.children);

    intersect.map((item,index)=>{
      return(
        item.object.name==="spehere1"?item.object.material.color.set(0xFFFFFF):null
      )
    })

    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animation);
window.addEventListener("resize",function(){
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})
