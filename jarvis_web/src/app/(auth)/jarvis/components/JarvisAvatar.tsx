"use client";

import type { VRM } from "@pixiv/three-vrm";
import type { GLTF, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
} from "@pixiv/three-vrm-animation";

import { JarvisControls } from "./JarvisControls";
import { JarvisRuntimeVrm, startAvatarLoop } from "../utils/avatar-loop";

export function JarvisAvatar() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentVrm = useRef<JarvisRuntimeVrm | null>(null);

  const mouseTarget = useRef(new THREE.Object3D());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const animationMixer = useRef<THREE.AnimationMixer | null>(null);
  const activeAction = useRef<THREE.AnimationAction | null>(null);
  const animations = useRef<THREE.AnimationClip[]>([]);
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);

  const [currentEmotion, setCurrentEmotion] = useState("neutral");

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.4, 3);
    cameraRef.current = camera;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 1.4, 0);
    // controls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    scene.add(mouseTarget.current);

    const loader = new GLTFLoader();
    loader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/jarvis.vrm",
      (gltf: GLTF) => {
        const vrm = gltf.userData.vrm as JarvisRuntimeVrm;

        VRMUtils.rotateVRM0(vrm as VRM);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        scene.add(vrm.scene);
        currentVrm.current = vrm;

        animationMixer.current = new THREE.AnimationMixer(vrm.scene);

        const vrmaLoader = new GLTFLoader();
        vrmaLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));

        vrmaLoader.load(
          "/standing_pose.vrma",
          (vrmaGltf) => {
            const vrmAnimations = vrmaGltf.userData.vrmAnimations;
            const vrmAnimation = vrmAnimations == null ? undefined : vrmAnimations[0];

            if (vrmAnimation) {
              const vrmClip = createVRMAnimationClip(vrmAnimation, vrm as VRM);

              if (animationMixer.current) {
                const action = animationMixer.current.clipAction(vrmClip);
                action.play();
                activeAction.current = action;
              }
            } else {
              console.warn("No valid VRMA data found in this file.");
            }
          },
          undefined,
          (err) => console.error("Failed to load VRMA:", err)
        );

        //set position
        vrm.scene.position.set(-1, 0.5, -.7);
        
      },
      (progress) => console.log("Loading VRM...", (progress.loaded / progress.total) * 100, "%"),
      (error) => console.error("Error loading VRM:", error)
    );

    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseTarget.current.position.set(x * 1.5, y * 1.5 + 1.4, 2);
    };
    window.addEventListener("mousemove", onMouseMove);

    const stopLoop = startAvatarLoop({
      animationMixer,
      currentVrm,
      analyser,
      dataArray,
      activeAction,
      renderer,
      scene,
      camera,
    });

    return () => {
      stopLoop();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();

      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const setEmotion = (emotion: string): void => {
    const vrm = currentVrm.current;
    if (!vrm) return;

    ["happy", "angry", "sad", "relaxed", "surprised"].forEach((expression) => {
      vrm.expressionManager?.setValue(expression, 0);
    });

    if (emotion !== "neutral") {
      vrm.expressionManager?.setValue(emotion, 1);
    }

    setCurrentEmotion(emotion);
  };

  const playAnimation = (animationName: string): void => {
    if (!currentVrm.current || !animationMixer.current) return;

    const clip = animations.current.find((animation) => animation.name === animationName);
    if (!clip) return;

    if (activeAction.current) {
      activeAction.current.stop();
    }

    const action = animationMixer.current.clipAction(clip);
    action.clampWhenFinished = true;
    action.play();
    activeAction.current = action;
  };

  const playSampleAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio("/male.mp3");
      audioRef.current = audio;

      const AudioContextClass =
        window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return;

      audioContext.current = new AudioContextClass();
      analyser.current = audioContext.current.createAnalyser();

      const source = audioContext.current.createMediaElementSource(audio);
      source.connect(analyser.current);
      analyser.current.connect(audioContext.current.destination);

      analyser.current.fftSize = 256;
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      audio.onended = () => setIsPlaying(false);
    }

    if (audioContext.current?.state === "suspended") {
      audioContext.current.resume();
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}