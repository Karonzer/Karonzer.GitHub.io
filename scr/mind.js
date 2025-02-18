import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");

    const start = async () => {
        console.log("start");

        // ✅ MindAR 초기화 (흔들림 방지 설정 추가)
        const mindarthree = new MindARThree({
            container: document.body,
            imageTargetSrc: "./Asset/targets.mind", // 여러 개의 타겟 포함된 파일
            filterMinCF: 0.0001, // 흔들림 방지 필터 적용
            missTolerance: 10    // 트래킹 손실 방지
        });

        const { renderer, scene, camera } = mindarthree;
        const loader = new GLTFLoader();

        // 📌 흔들림 방지를 위한 변수 설정
        const smoothingFactor = 0.1; // 낮을수록 부드러움
        let lastPositions = {};
        let lastQuaternions = {};

        // ✅ 첫 번째 이미지 타겟 (인덱스 0)에 연결될 모델
        const anchor0 = mindarthree.addAnchor(0);
        lastPositions[0] = new THREE.Vector3();
        lastQuaternions[0] = new THREE.Quaternion();

        loader.load("./Asset/shiba/scene.gltf", (gltf) => {
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.position.set(0, -0.2, 0);
            anchor0.group.add(gltf.scene);
        });

        // ✅ 두 번째 이미지 타겟 (인덱스 1)에 연결될 모델
        const anchor1 = mindarthree.addAnchor(1);
        lastPositions[1] = new THREE.Vector3();
        lastQuaternions[1] = new THREE.Quaternion();

        loader.load("./Asset/musca/scene.gltf", (gltf) => {
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.position.set(0, -0.2, 0);
            anchor1.group.add(gltf.scene);
        });

        // ✅ MindAR 시작
        await mindarthree.start();

        // 📌 렌더링 루프 (흔들림 방지 적용)
        renderer.setAnimationLoop(() => {
            [anchor0, anchor1].forEach((anchor, index) => {
                if (anchor.group) {
                    anchor.group.position.lerp(lastPositions[index], smoothingFactor);
                    anchor.group.quaternion.slerp(lastQuaternions[index], smoothingFactor);

                    lastPositions[index].copy(anchor.group.position);
                    lastQuaternions[index].copy(anchor.group.quaternion);
                }
            });

            renderer.render(scene, camera);
        });
    };

    start();
});
