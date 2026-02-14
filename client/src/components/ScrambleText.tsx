import { useState, useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#';

interface Props {
  children: string;
  trigger: boolean;
  className?: string;
}

export default function ScrambleText({ children: text, trigger, className }: Props) {
  const [output, setOutput] = useState(text);
  const played = useRef(false);

  useEffect(() => {
    if (!trigger || played.current) return;
    played.current = true;

    const len = text.length;
    let progress = 0;

    const id = setInterval(() => {
      setOutput(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < progress) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      progress += 0.35;
      if (progress >= len) {
        clearInterval(id);
        setOutput(text);
      }
    }, 30);

    return () => clearInterval(id);
  }, [trigger, text]);

  return <span className={className}>{output}</span>;
}
