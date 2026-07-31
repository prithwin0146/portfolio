import { useState, useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#';

interface Props {
  children: string;
  trigger: boolean;
  className?: string;
}

export default function ScrambleText({ children: text, trigger, className }: Props) {
  const [output, setOutput] = useState(text);
  // Track the last text we scrambled so re-running on language change works
  const lastText = useRef('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Always keep output in sync if not mid-scramble
    if (!trigger) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOutput(text);
      return;
    }

    // Debounce: if text changes (language switch) or trigger fires fresh, scramble again
    if (text === lastText.current) return;
    lastText.current = text;

    // Clear any previous animation
    if (intervalRef.current) clearInterval(intervalRef.current);

    const len = text.length;
    let progress = 0;

    intervalRef.current = setInterval(() => {
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
        clearInterval(intervalRef.current!);
        setOutput(text);
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, text]);

  return <span className={className}>{output}</span>;
}
