import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { names, imageUris } from "./cardsArray.json";

const COMMON_PREFIX = "https://img.scryfall.com/cards/normal/";
const searchOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};
const fuse = new Fuse(names, searchOptions);

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
/* eslint-disable */
const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
/* eslint-enable */

const recognition = new SpeechRecognition();
//recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 10;

export default function useCardRecognition() {
  const [cardMatch, setCardMatch] = useState("");
  const [recognitionInProgress, setRecogitionInProgress] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [recognitionError, setRecognitionError] = useState(null);
  const [recognitionNoMatch, setRecognitionNoMatch] = useState(false);

  function handleError(event) {
    setRecognitionError(event.error);
  }
  function handleNoMatch() {
    setRecognitionNoMatch(true);
  }

  function startRecognition() {
    setRecognitionError(null);
    setRecognitionNoMatch(false);
    if (!recognitionInProgress) {
      setRecogitionInProgress(true);
      recognition.start();
    }
  }

  function handleResult(event) {
    const last = event.results.length - 1;
    const card = (event.results[last][0].transcript || "").toLowerCase();

    setCardMatch(card);

    if (card) {
      try {
        const normal_image_uri = imageUris[fuse.search(card)[0].item];
        if (normal_image_uri) {
          setImageUri(`${COMMON_PREFIX}${normal_image_uri}`);
        }
      } catch {
        setImageUri("");
      }
    } else {
      setImageUri("");
    }
  }

  function handleSpeechEnd() {
    recognition.stop();
    setRecogitionInProgress(false);
  }

  useEffect(() => {
    recognition.onresult = handleResult;
    recognition.onspeechend = handleSpeechEnd;
    recognition.onerror = handleError;
    recognition.onnomatch = handleNoMatch;
  }, []);

  return {
    cardMatch,
    recognitionInProgress,
    startRecognition,
    imageUri,
    recognitionError,
    recognitionNoMatch,
  };
}
