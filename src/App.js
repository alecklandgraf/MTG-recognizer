import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { names, imageUris } from "./cardsArray.json";
import "./App.css";
import Button from "@material-ui/core/Button";

const COMMON_PREFIX = "https://img.scryfall.com/cards/normal/";

const searchOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1
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

recognition.onnomatch = function(event) {
  console.log("I didnt recognise that color.");
};

recognition.onerror = function(event) {
  console.log("Error occurred in recognition: " + event.error);
};

function useCardRecognized() {
  const [cardMatch, setCardMatch] = useState("");
  const [recognitionInProgress, setRecogitionInProgress] = useState(false);
  const [imageUri, setImageUri] = useState("");

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
  }, []);

  return {
    cardMatch,
    recognitionInProgress,
    setRecogitionInProgress,
    imageUri
  };
}

function App() {
  const {
    cardMatch,
    recognitionInProgress,
    setRecogitionInProgress,
    imageUri
  } = useCardRecognized();

  function handleClick() {
    if (!recognitionInProgress) {
      setRecogitionInProgress(true);
      recognition.start();
      console.log("Ready to hear a card");
    }
  }

  return (
    <div className="App">
      <Button
        className="upside-down"
        onClick={handleClick}
        variant="contained"
        size="large"
        disabled={recognitionInProgress}
      >
        {recognitionInProgress ? "listening" : "Click to start recording"}
      </Button>
      <div className="card-display">
        {imageUri ? (
          <div className="cards">
            <img
              src={imageUri}
              alt={`Magic The Gathering Card ${cardMatch}`}
              height="350"
            />
            <img
              src={imageUri}
              alt={`Magic The Gathering Card ${cardMatch}`}
              height="350"
              className="upside-down"
            />
          </div>
        ) : (
          <div className="spacer" />
        )}
      </div>
      <Button
        onClick={handleClick}
        size="large"
        variant="contained"
        disabled={recognitionInProgress}
      >
        {recognitionInProgress ? "listening" : "Click to start recording"}
      </Button>
    </div>
  );
}

export default App;
