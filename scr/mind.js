import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");

    const start = async () => {
        console.log("start");
        
        // ✅ 여러 개의 타겟을 포함한 targets.mind 파일 사용
        const mindarthree = new MindARThree({
            container: document.body,
            imageTargetSrc: "./Asset/targets.mind",  // 여러 개의 타겟 포함된 파일
        });

        const { renderer, scene, camera } = mindarthree;
        const loader = new GLTFLoader();

        // ✅ 첫 번째 이미지 타겟 (인덱스 0)에 연결될 모델
        const anchor0 = mindarthree.addAnchor(0);
        loader.load("./Asset/shiba/scene.gltf", (gltf) => {
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.rotation.set(-30, 0, 0);
            anchor0.group.add(gltf.scene);
        });

        // ✅ 두 번째 이미지 타겟 (인덱스 1)에 연결될 모델
        const anchor1 = mindarthree.addAnchor(1);
        loader.load("./Asset/musca/scene.gltf", (gltf) => {
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.rotation.set(-30, 0, 0);
            anchor1.group.add(gltf.scene);
        });

        // ✅ MindAR 시작
        await mindarthree.start();

        // 렌더링 루프
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    };

    start();
});
