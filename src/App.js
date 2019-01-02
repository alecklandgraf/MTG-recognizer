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

function App() {
  const [cardMatch, setCardMatch] = useState("");
  const [recognitionInProgress, setRecogitionInProgress] = useState(false);

  function handleResult(event) {
    var last = event.results.length - 1;
    const card = event.results[last][0].transcript;

    setCardMatch((card || "").toLowerCase());
  }

  function handleSpeechEnd() {
    recognition.stop();
    setRecogitionInProgress(false);
  }

  function handleClick() {
    if (!recognitionInProgress) {
      setRecogitionInProgress(true);
      recognition.start();
      console.log("Ready to hear a card");
    }
  }

  useEffect(() => {
    recognition.onresult = handleResult;
    recognition.onspeechend = handleSpeechEnd;
  }, []);

  let normal_image_uri;
  let results;

  if (cardMatch) {
    results = fuse.search(cardMatch);
    // console.log(results);
    try {
      normal_image_uri = imageUris[results[0].item];
      if (normal_image_uri) {
        normal_image_uri = `${COMMON_PREFIX}${normal_image_uri}`;
      }
    } catch {
      normal_image_uri = "";
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
        {normal_image_uri ? (
          <div className="cards">
            <img
              src={normal_image_uri}
              alt={`Magic The Gathering Card ${cardMatch}`}
              height="350"
            />
            <img
              src={normal_image_uri}
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
