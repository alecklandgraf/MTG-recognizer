import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const App = React.lazy(() => import("./App"));

if (SpeechRecognition) {
  ReactDOM.render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <div className="App-header">
      Speech recognition unsupported on this browser, try chrome desktop,
      android chrome, or Firefox
    </div>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
