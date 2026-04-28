import type { RefObject } from "react";
import type { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type JarvisRuntimeVrm = VRM & {
  humanoid?: {
    getNormalizedBoneNode: (boneName: string) => THREE.Object3D | null;
  } | null;
  expressionManager?: {
    setValue: (expressionName: string, value: number) => void;
  } | null;
  update: (deltaTime: number) => void;
};

type StartAvatarLoopArgs = {
  animationMixer: RefObject<THREE.AnimationMixer | null>;
  currentVrm: RefObject<JarvisRuntimeVrm | null>;
  analyser: RefObject<AnalyserNode | null>;
  dataArray: RefObject<Uint8Array<ArrayBuffer> | null>;
  activeAction: RefObject<THREE.AnimationAction | null>;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
};

export function startAvatarLoop({
  animationMixer,
  currentVrm,
  analyser,
  dataArray,
  activeAction,
  renderer,
  scene,
  camera,
}: StartAvatarLoopArgs) {
  const clock = new THREE.Clock();
  let animationFrameId: number | null = null;

  const animate = () => {
    animationFrameId = window.requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const time = clock.elapsedTime;

    if (animationMixer.current) {
      animationMixer.current.update(deltaTime);
    }

    if (currentVrm.current) {
      const blinkTrack = Math.sin(time * Math.PI * 0.5);
      const blinkValue = blinkTrack > 0.98 ? 1 : 0;
      currentVrm.current.expressionManager?.setValue("blink", blinkValue);

      if (analyser.current && dataArray.current) {
        analyser.current.getByteFrequencyData(dataArray.current);
        let totalVolume = 0;

        for (let index = 0; index < dataArray.current.length; index += 1) {
          totalVolume += dataArray.current[index];
        }

        const averageVolume = totalVolume / dataArray.current.length;
        currentVrm.current.expressionManager?.setValue(
          "aa",
          Math.min(averageVolume / 100, 1)
        );
      }

      const isAnimationPlaying = activeAction.current?.isRunning() ?? false;

      if (!isAnimationPlaying) {
        const humanoid = currentVrm.current.humanoid;

        if (humanoid) {
          const leftArm = humanoid.getNormalizedBoneNode("leftUpperArm");
          const rightArm = humanoid.getNormalizedBoneNode("rightUpperArm");
          const spine = humanoid.getNormalizedBoneNode("spine");
          const neck = humanoid.getNormalizedBoneNode("neck");

          const breathe = Math.sin(time * Math.PI * 0.5);

          if (leftArm) leftArm.rotation.z = 1.2 + breathe * 0.01;
          if (rightArm) rightArm.rotation.z = -1.2 - breathe * 0.01;
          if (spine) spine.rotation.x = breathe * 0.02;
          if (neck) neck.rotation.x = -(breathe * 0.01);
        }
      }

      currentVrm.current.update(deltaTime);
    }

    renderer.render(scene, camera);
  };

  animate();

  return () => {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
    }
  };
}