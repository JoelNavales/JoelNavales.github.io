import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// Types the text out once, pausing after punctuation and varying the beat so it reads like a
// person typing. Screen readers get the whole text at once, an invisible copy holds the final
// width so nothing shifts, and the caret stops blinking within five seconds (WCAG 2.2.2).
export default function TypingText({ text, delay = 450 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let count = 0;
    let timer = window.setTimeout(function typeNext() {
      count += 1;
      setTyped(count);
      if (count >= text.length) return;
      const pause = /[,.!?]/.test(text[count - 1]) ? 280 : 45 + Math.random() * 60;
      timer = window.setTimeout(typeNext, pause);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [text, delay, reduced]);

  const shown = reduced ? text.length : typed;
  return (
    <span className="typing">
      <span className="sr-only">{text}</span>
      <span className="typing-ghost" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!reduced && <span className={shown >= text.length ? 'caret is-done' : 'caret'} />}
      </span>
    </span>
  );
}
