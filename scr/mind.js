import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

console.log("THREE",THREE);
console.log("MindARThree",MindARThree);
console.log("GLTFLoader",GLTFLoader);

document.addEventListener("DOMContentLoaded", () => 
{
    console.log("DOMContentLoaded");

    const start = async() => 
    {
        console.log("start");
        const mindarthree = new MindARThree(
            {
                container : document.body,
                imageTargetSrc : "./Asset/targets.mind",
            }
        );

        const {renderer ,scene, camera} = mindarthree;

        // const geometry = new THREE.PlaneGeometry(1, 1);
        // const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );

        // const plane = new THREE.Mesh(geometry,material);

        // const anchor = mindarthree.addAnchor(0);
        // anchor.group.add(plane);

        const anchor = mindarthree.addAnchor(0);

        const loader = new GLTFLoader();
        loader.load( "./Asset/shiba/scene.gltf", (gltf) => 
        {
            gltf.scene.position.set(0,0,0);
            gltf.scene.rotation.set(-30,0,0);
            anchor.group.add(gltf.scene);
        });

        await mindarthree.start();

        renderer.setAnimationLoop(()=>
        {
            renderer.render(scene,camera);
        });

        mindarthree.start();
    }

    start();
});
