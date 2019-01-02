import React from "react";
import "./App.css";
import useCardRecognition from "./useCardRecognition";
import Button from "@material-ui/core/Button";

function App() {
  const {
    cardMatch,
    recognitionInProgress,
    startRecognition,
    imageUri,
  } = useCardRecognition();

  return (
    <div className="App">
      <Button
        className="upside-down"
        onClick={startRecognition}
        variant="contained"
        size="large"
        disabled={recognitionInProgress}
      >
        {recognitionInProgress ? "listening" : "Click to start recording"}
      </Button>
      <div className="card-display">
        {imageUri ? (
          <div className="cards">
            <img src={imageUri} alt={`Magic The Gathering Card ${cardMatch}`} />
            <img
              src={imageUri}
              alt={`Magic The Gathering Card ${cardMatch}`}
              className="upside-down"
            />
          </div>
        ) : (
          <div className="spacer" />
        )}
      </div>
      <Button
        onClick={startRecognition}
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
