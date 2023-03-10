import * as THREE from "three"
import { InteractionManager } from "three.interactive";
import gsap from "gsap";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export default class Initialize {

  constructor() {

    const scene = new THREE.Scene();

   /*  const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth/window.innerHeight,
      0.01,
      10
    )//END camera */
     //*camera */
     const fov = 40;
     const aspect = window.innerWidth/window.innerHeight;//canvas default
     const near = 1;
     const far = 1000;
     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
     camera.position.set(0,2,4);
     scene.add(camera)
     //*END camera */

     //*Light  */
     /* ambient light  */
     const al = new THREE.AmbientLight(0xffffff, 0.5)
     scene.add(al)
     /* spotlight */
     const spotLight = new THREE.SpotLight(0xffffff, 1.5);
     spotLight.position.set(0,2,0);
     spotLight.angle = .8;
     spotLight.penumbra = 1;

     spotLight.decay =0.1;
     spotLight.distance = 100;
     spotLight.castShadow = true;
     scene.add(spotLight);

     /* 
     spotLight.shadow.mapSize.width = 2048;
     spotLight.shadow.mapSize.height = 2048;
     spotLight.shadow.camera.near = 1;
     spotLight.shadow.camera.far = 5;
 */
     //*END Light  */


     //* floor */
   /*  const geometryFloor = new THREE.PlaneGeometry(30,10); //x,z
    const materialFloor = new THREE.MeshPhongMaterial({color: 0x284e75, side: THREE.DoubleSide});
    const floor = new THREE.Mesh(geometryFloor, materialFloor);
    floor.rotation.x = Math.PI/2;
    scene.add(floor);
    floor.receiveShadow = true; */
  //*END floor */


    camera.position.z = 1;

    scene.add(camera);

//*box  */
const texture = new THREE.TextureLoader().load("../assets/crate.gif")
    const geometry = new THREE.BoxGeometry(.5,.5,.5)//X,Y,Z

    const material = new THREE.MeshPhongMaterial({map: texture});//bestemmer hvad matriale kassen skal have

    const mesh = new THREE.Mesh(geometry, material);//den færdige kasse
    mesh.castShadow =true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    mesh.position.y =0.5;
    mesh.position.set (-1,1,-1)
    /*     mesh.rotation.x = 10;
        mesh.rotation.y = 10; */

//*END box  */

//*3d model*/
const loader = new GLTFLoader();
loader.load("../assets/models/scene.gltf", (gltf)=>{
  let model = gltf.scene;
  model.position.set(0,.5,0);
  model.scale.set(.05,.05,.05);

  this.animateGlobe(model, camera);

    model.traverse((n)=>{
      if (n.isMesh) {
        n.castShadow = true;
        //n.recieveShadow = true
      }
    })

 

    scene.add(model, camera);
})

//*END 3d model*/

//*hemilight  */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 2)
scene.add(hemiLight);

const spotLightB = new THREE.SpotLight(0xffffff, 10);
spotLightB.position.set(0,3,0)
scene.add(spotLightB);

const dlHelper = new THREE.SpotLightHelper(spotLightB);
scene.add(dlHelper)
//*END hemilight  */

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );
    interactionManager.add(mesh);

    mesh.addEventListener("click", (event)=>{
      gsap.to(event.target.scale, {
        duration: 1,
        y: 0.15,
        x: 0.15,
        z: 0.15,
        repeat: 1,
        yoyo: true,
        ease: "bounce.out"
      })
    })

    renderer. setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
 

    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement)


    renderer.setAnimationLoop( (time) => this.animation(
      time,
      {camera,scene,mesh,renderer}
    ));
    

    //* gridHelper  */
      const size = 20;
      const divisions = 20;
      const gridHelper = new THREE.GridHelper(size, divisions);
      scene.add(gridHelper);
    
    //*END gridHelper  */

    //*OrbitControl */
    let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
    //*END OrbitControl */
    
    window.addEventListener("resize", ()=>{
      this.OnWindowResized(renderer, camera)
    });

   
    
  } // END constructor


  animation(time, obj) {

    //obj.mesh.rotation.x += 0.01;
    //obj.mesh.rotation.y += 0.01;
    
    /* obj.mesh.rotation.x = time/1000;
    obj.mesh.rotation.y = time/1000; */
    obj.renderer.render(obj.scene, obj.camera);
  };


  OnWindowResized(renderer, camera ) {
    renderer.setSize( window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  }

  animateGlobe(model, camera) {
    gsap.to(model.rotation, {
      delay: 1,
      y: .5,
      x: -.5,
      duration: 2,
        onComplete: ()=>{
          gsap.to(model.rotation, {
            duration: 5,
            y: .015,
            x: .015,
            z: .015,
            repeat: -1,
            yoyo: true,
          })
        }
    })
  }

} // END class
