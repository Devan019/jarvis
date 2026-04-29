"use client";

import type { VRM } from "@pixiv/three-vrm";
import type { GLTF, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from "@pixiv/three-vrm-animation";

import { JarvisRuntimeVrm, startAvatarLoop } from "../utils/avatar-loop";

export function JarvisAvatar() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentVrm = useRef<JarvisRuntimeVrm | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSource = useRef<MediaSource | null>(null);
  const sourceBuffer = useRef<SourceBuffer | null>(null);
  const audioQueue = useRef<ArrayBuffer[]>([]);

  const animationMixer = useRef<THREE.AnimationMixer | null>(null);
  const activeAction = useRef<THREE.AnimationAction | null>(null);

  //for sample audios
  const fillerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Scene setup
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.4, 3);
    cameraRef.current = camera;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const loader = new GLTFLoader();
    loader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

    loader.load("/jarvis.vrm", (gltf: GLTF) => {
      const vrm = gltf.userData.vrm as JarvisRuntimeVrm;
      VRMUtils.rotateVRM0(vrm as VRM);
      VRMUtils.removeUnnecessaryJoints(gltf.scene);
      scene.add(vrm.scene);
      currentVrm.current = vrm;

      animationMixer.current = new THREE.AnimationMixer(vrm.scene);
      const vrmaLoader = new GLTFLoader();
      vrmaLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));

      vrmaLoader.load("/standing_pose.vrma", (vrmaGltf) => {
        const vrmAnimations = vrmaGltf.userData.vrmAnimations;
        const vrmAnimation = vrmAnimations == null ? undefined : vrmAnimations[0];

        if (vrmAnimation && animationMixer.current) {
          const vrmClip = createVRMAnimationClip(vrmAnimation, vrm as VRM);
          const action = animationMixer.current.clipAction(vrmClip);
          action.play();
          activeAction.current = action;
        }
      }
      );

      vrm.scene.position.set(-0.9, -2.5, 0);
      vrm.scene.scale.set(2.5, 2.5, 2.5);
      vrm.scene.rotation.set(0, Math.PI + Math.PI / 18, 0);

    }
    );
    ``
    const stopLoop = startAvatarLoop({
      animationMixer, currentVrm, analyser, dataArray, activeAction, renderer, scene, camera,
    });

    return () => {
      stopLoop();
      renderer.dispose();
      if (audioContext.current) audioContext.current.close();
    };
  }, []);

  // Streaming Audio Setup
  const processAudioQueue = () => {
    if (!sourceBuffer.current || sourceBuffer.current.updating || audioQueue.current.length === 0) return;
    const chunk = audioQueue.current.shift();
    if (chunk) sourceBuffer.current.appendBuffer(chunk);
  };

  const initAudioPipeline = () => {
    if (audioRef.current) return; // Prevent double initialization

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext.current = new AudioContextClass();
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 256;
    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);

    // 1. Setup Streaming Audio (For Backend TTS)
    const audio = new Audio();
    audioRef.current = audio;
    mediaSource.current = new MediaSource();
    audio.src = URL.createObjectURL(mediaSource.current);

    mediaSource.current.addEventListener("sourceopen", () => {
      sourceBuffer.current = mediaSource.current!.addSourceBuffer("audio/mpeg");
      sourceBuffer.current.addEventListener("updateend", processAudioQueue);
    });

    const source = audioContext.current.createMediaElementSource(audio);
    source.connect(analyser.current);

    // 2. Setup Filler Audio (For Pre-recorded MP3s)
    const fillerAudio = new Audio();
    fillerAudioRef.current = fillerAudio;
    const fillerSource = audioContext.current.createMediaElementSource(fillerAudio);
    fillerSource.connect(analyser.current); // Connects to the SAME analyzer!

    // Connect analyzer to speakers
    analyser.current.connect(audioContext.current.destination);

    // Sync play states
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);
    fillerAudio.onplay = () => setIsPlaying(true);
    fillerAudio.onended = () => setIsPlaying(false);
    fillerAudio.onpause = () => setIsPlaying(false);
  };

  useEffect(() => {

    // Listen for TTS Chunks
    const handleAudioChunk = async (event: Event) => {
      const customEvent = event as CustomEvent<ArrayBuffer>;
      const bytes = new Uint8Array(customEvent.detail);

      initAudioPipeline();
      if (audioContext.current?.state === "suspended") await audioContext.current.resume();

      audioQueue.current.push(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
      processAudioQueue();

      if (audioRef.current?.paused) {
        try { await audioRef.current.play(); } catch (e) { }
      }
    };

    // Listen for "Play Filler" event
    const handlePlayFiller = async (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      initAudioPipeline();
      if (audioContext.current?.state === "suspended") await audioContext.current.resume();
      
      console.log("Playing filler audio:", customEvent.detail);
      if (fillerAudioRef.current) {
        fillerAudioRef.current.src = customEvent.detail;
        fillerAudioRef.current.currentTime = 0;
        fillerAudioRef.current.play().catch(e => console.error("Filler blocked:", e));
      }
    };

    // Listen for "Stop Filler" event
    const handleStopFiller = () => {
      if (fillerAudioRef.current) {
        fillerAudioRef.current.pause();
      }
    };

    window.addEventListener("jarvis-audio-chunk", handleAudioChunk);
    window.addEventListener("jarvis-play-filler", handlePlayFiller);
    window.addEventListener("jarvis-stop-filler", handleStopFiller);

    return () => {
      window.removeEventListener("jarvis-audio-chunk", handleAudioChunk);
      window.removeEventListener("jarvis-play-filler", handlePlayFiller);
      window.removeEventListener("jarvis-stop-filler", handleStopFiller);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}