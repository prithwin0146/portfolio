import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(texts: string[], typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);

          if (charIndex + 1 === currentText.length) {
            pauseRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);

          if (charIndex <= 1) {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => {
      clearTimeout(timeout);
      if (pauseRef.current) clearTimeout(pauseRef.current);
    };
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}
