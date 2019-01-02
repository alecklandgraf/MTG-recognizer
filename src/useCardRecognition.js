import { useState } from "react";
import Fuse from "fuse.js";
import { names, imageUris } from "./cardsArray.json";
import useWebSpeech from "./useWebSpeech";

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

export default function useCardRecognition() {
  const {
    error,
    inProgress,
    noMatch,
    results,
    startRecognition,
  } = useWebSpeech();

  const [cardMatch, setCardMatch] = useState("");
  const [imageUri, setImageUri] = useState("");

  if (results) {
    const last = results.length - 1;
    const card = (results[last][0].transcript || "").toLowerCase();

    if (card !== cardMatch) {
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
  }

  return {
    cardMatch,
    recognitionInProgress: inProgress,
    startRecognition,
    imageUri,
    recognitionError: error,
    recognitionNoMatch: noMatch,
  };
}
