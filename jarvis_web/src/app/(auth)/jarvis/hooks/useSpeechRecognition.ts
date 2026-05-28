"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContext";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContext";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone();

  const accumulatedText = useRef<string>("");
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const hasUnprocessedSpeechRef = useRef<boolean>(false);

  // 1. Initialize microphone on mount
  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Connect to Deepgram once mic is ready
  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true, // Keep true to get fast updates
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 2000, // Detect end of a phrase safely
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  // 3. Watchdog: Checks if 2 seconds of silence passed to fire text to Jarvis
  useEffect(() => {
    const watchdog = setInterval(() => {
      if (connectionState === LiveConnectionState.OPEN && hasUnprocessedSpeechRef.current) {
        const timeSinceLastSpeech = Date.now() - lastSpeechTimeRef.current;

        if (timeSinceLastSpeech >= 2000) {
          const finalSpokenText = accumulatedText.current.trim();

          if (finalSpokenText) {
            console.log("🎙️ Sending final text block to Jarvis:", finalSpokenText);
            
            // Dispatch to Jarvis Event Pipeline
            window.dispatchEvent(
              new CustomEvent("jarvis-user-speech", { detail: finalSpokenText })
            );

            // Clean up states for the next utterance window
            setTranscript("");
            setInterimTranscript("");
            accumulatedText.current = "";
            hasUnprocessedSpeechRef.current = false;
          }
        }
      }
    }, 400);

    return () => clearInterval(watchdog);
  }, [connectionState]);

  // 4. Data Streaming and Event Triggers
  useEffect(() => {
    if (!microphone || !connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0 && connectionState === LiveConnectionState.OPEN) {
        connection.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal } = data;
      let incomingText = data.channel.alternatives[0]?.transcript;

      if (incomingText && incomingText.trim() !== "") {
        // Human is talking -> update parameters for silence tracker
        lastSpeechTimeRef.current = Date.now();
        hasUnprocessedSpeechRef.current = true;

        if (isFinal) {
          accumulatedText.current = accumulatedText.current
            ? `${accumulatedText.current} ${incomingText}`
            : incomingText;
          setTranscript(accumulatedText.current);
          setInterimTranscript("");
        } else {
          setInterimTranscript(incomingText);
        }
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
      
      if (microphoneState !== MicrophoneState.Open) {
        startMicrophone();
      }
      setIsListening(true);
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState, microphone, connection]);

  // 5. Deepgram Socket KeepAlive
  useEffect(() => {
    let keepAliveInterval: any;
    if (!connection) return;

    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive();
      keepAliveInterval = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    }

    return () => clearInterval(keepAliveInterval);
  }, [microphoneState, connectionState, connection]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopMicrophone();
      setIsListening(false);
    } else {
      startMicrophone();
      setIsListening(true);
      lastSpeechTimeRef.current = Date.now();
    }
  }, [isListening, startMicrophone, stopMicrophone]);

  return {
    isListening,
    transcript,
    interimTranscript,
    microphone,
    toggleListening,
  };
}