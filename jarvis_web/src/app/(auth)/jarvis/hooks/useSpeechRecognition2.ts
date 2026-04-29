import { useEffect, useRef, useState, useCallback } from "react";

interface TranscriptItem {
  id: number;
  text: string;
  isFinal: boolean;
  timestamp: Date;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);

  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef(false);
  const hasAutoStartedRef = useRef(false);
  const isJarvisSpeakingRef = useRef(false);

  //  Silence Tracking
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const hasUnprocessedSpeechRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The Watchdog: Checks every 500ms if 3 seconds have passed since last speech
  useEffect(() => {
    const watchdog = setInterval(() => {
      // Only run if we are actively listening and have text waiting
      if (shouldKeepListeningRef.current && hasUnprocessedSpeechRef.current && !isJarvisSpeakingRef.current) {

        const timeSinceLastSpeech = Date.now() - lastSpeechTimeRef.current;

        // If 3 seconds (3000ms) have passed
        if (timeSinceLastSpeech >= 3000) {
          const finalSpokenText = transcriptRef.current.trim();

          if (finalSpokenText) {
            console.log("🎙️ Data captured after 3s pause:", finalSpokenText);

            // Dispatch to Jarvis
            window.dispatchEvent(
              new CustomEvent("jarvis-user-speech", { detail: finalSpokenText })
            );

            // Reset states for the next sentence
            setTranscript("");
            transcriptRef.current = "";
            setInterimTranscript("");
            hasUnprocessedSpeechRef.current = false; // Mark as processed
          }
        }
      }
    }, 500);

    return () => clearInterval(watchdog);
  }, []);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleJarvisSpeaking = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      const isSpeaking = customEvent.detail;

      isJarvisSpeakingRef.current = isSpeaking;

      if (isSpeaking) {
        // Jarvis started talking. Stop the mic to prevent feedback.
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
          clearRestartTimeout();
        }
      } else {
        // Jarvis finished talking. Turn the mic back on if we were in "listening" mode.
        if (shouldKeepListeningRef.current && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch { }
        }
      }
    };

    window.addEventListener("jarvis-is-speaking", handleJarvisSpeaking);
    return () => window.removeEventListener("jarvis-is-speaking", handleJarvisSpeaking);
  }, [isListening, clearRestartTimeout]);

  const appendFinalTranscript = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTranscriptString = `${transcriptRef.current}${trimmedText} `;
    transcriptRef.current = newTranscriptString;
    setTranscript(newTranscriptString);

    const newTranscript: TranscriptItem = {
      id: Date.now(),
      text: trimmedText,
      isFinal: true,
      timestamp: new Date(),
    };

    setTranscripts((prev) => [...prev, newTranscript].slice(-3));
  }, []);

  useEffect(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };

    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setInterimTranscript("");
    };

    recognition.onresult = (event: any) => {
      // Every time the mic hears a word, update the timestamp
      lastSpeechTimeRef.current = Date.now();
      hasUnprocessedSpeechRef.current = true;

      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcriptSegment + " ";
        else interim += transcriptSegment;
      }

      setInterimTranscript(interim);
      if (finalTranscript) appendFinalTranscript(finalTranscript);
    };

    recognition.onend = () => {
      if (!shouldKeepListeningRef.current) {
        setIsListening(false);
        return;
      }

      // Chrome auto-stops after 1.5s of silence. This restarts it instantly.
      clearRestartTimeout();
      restartTimeoutRef.current = setTimeout(() => {
        if (!recognitionRef.current || !shouldKeepListeningRef.current) return;
        try { recognitionRef.current.start(); } catch { }
      }, 250);
    };

    return () => {
      clearRestartTimeout();
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [appendFinalTranscript, clearRestartTimeout]);

  // Auto-start
  useEffect(() => {
    if (hasAutoStartedRef.current || !recognitionRef.current) return;
    hasAutoStartedRef.current = true;
    shouldKeepListeningRef.current = true;
    setIsListening(true);
    lastSpeechTimeRef.current = Date.now(); // Initialize timer

    try { recognitionRef.current.start(); } catch {
      setIsListening(false);
      shouldKeepListeningRef.current = false;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      shouldKeepListeningRef.current = true;
      setTranscript("");
      transcriptRef.current = "";
      setTranscripts([]);
      setInterimTranscript("");
      hasUnprocessedSpeechRef.current = false;
      lastSpeechTimeRef.current = Date.now(); // Reset timer
      setIsListening(true);
      try { recognitionRef.current.start(); } catch { }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current.stop();
      clearRestartTimeout();
    }
  }, [clearRestartTimeout, isListening]);

  const toggleListening = useCallback(() => {
    isListening ? stopListening() : startListening();
  }, [isListening, startListening, stopListening]);

  return {
    isListening, transcript, interimTranscript, transcripts, toggleListening
  };
}