import { useState, useEffect } from "react";

export default function useWebSpeech(config) {
  const [recognition, setRecognition] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [noMatch, setNoMatch] = useState(false);
  const [results, setResults] = useState(null);

  function handleError(event) {
    setError(event.error);
  }
  function handleNoMatch() {
    setNoMatch(true);
  }

  function startRecognition() {
    setError(null);
    setNoMatch(false);
    if (!inProgress) {
      setInProgress(true);
      recognition.start();
    }
  }

  // for some reason recognition is `null` unless I pass it in, even if handleSpeechEnd is an arrow funtion
  function handleSpeechEnd(recognition) {
    recognition.stop();
    setInProgress(false);
  }

  function handleResult(event) {
    setResults(event.results);
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    Object.assign(
      recognition,
      { lang: "en-US", interimResults: false, maxAlternatives: 1 },
      config
    );
    setRecognition(recognition);

    recognition.onresult = handleResult;
    recognition.onspeechend = () => handleSpeechEnd(recognition);
    recognition.onerror = handleError;
    recognition.onnomatch = handleNoMatch;
  }, []);

  return {
    error,
    inProgress,
    noMatch,
    results,
    startRecognition,
    stopRecognition: handleSpeechEnd,
  };
}
