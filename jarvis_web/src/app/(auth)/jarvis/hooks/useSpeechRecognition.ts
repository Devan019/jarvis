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
  
  const recognitionRef = useRef<any>(null);
  
  // NEW: Ref to hold our silence countdown timer
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };

    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false; 
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // NEW: Helper function to restart the 2-second countdown
    const resetSilenceTimeout = () => {
      // Clear the existing timer
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      // Start a new 2-second timer
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("2 seconds of silence detected. Auto-stopping mic.");
        setIsListening(false);
        recognition.stop();
      }, 5000); // 5000 milliseconds = 5 seconds
    };

    recognition.onstart = () => {
      setInterimTranscript("");
      // Start the countdown as soon as the mic opens, in case they say nothing
      resetSilenceTimeout(); 
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment + " ";
        } else {
          interim += transcriptSegment;
        }
      }

      setInterimTranscript(interim);

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        const newTranscript: TranscriptItem = {
          id: Date.now(),
          text: finalTranscript.trim(),
          isFinal: true,
          timestamp: new Date(),
        };
        setTranscripts((prev) => [...prev, newTranscript].slice(-10));
      }

      // NEW: We heard something! Reset the 2-second countdown.
      resetSilenceTimeout();
    };

    recognition.onend = () => {
      // Clear the timeout if the mic stops for any reason
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setTranscripts([]);
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Prevent crashing if already started
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
      
      // Clean up the timer when manually stopped
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setTranscripts([]);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    transcripts,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
  };
}