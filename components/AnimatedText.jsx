"use client";

import { useState, useEffect } from "react";

export const AnimatedText = ({ phrases, className = "" }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const words = currentPhrase.split(" ");

    if (!isDeleting && currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(words.slice(0, currentWordIndex + 1).join(" "));
        setCurrentWordIndex(currentWordIndex + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else if (!isDeleting && currentWordIndex === words.length) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isDeleting && displayedText.length > 0) {
      const timer = setTimeout(() => {
        const words = displayedText.split(" ");
        words.pop();
        setDisplayedText(words.join(" "));
        setCurrentWordIndex(words.length);
      }, 100);
      return () => clearTimeout(timer);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentWordIndex(0);
      setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
    }
  }, [currentWordIndex, currentPhraseIndex, phrases, isDeleting, displayedText]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
