// Language Service — manages language state with localStorage persistence
// and an observer pattern so all consumers react to changes instantly.

export type Language =
  | 'english'
  | 'sarcasm'
  | 'binary'
  | 'emoji'
  | 'lorem'
  | 'youngStunnah';

const LANGUAGE_KEY = 'portfolio_language';
const listeners: Array<(language: Language) => void> = [];

/** Get the persisted language (defaults to 'english'). */
export function getLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'english';
  } catch {
    return 'english';
  }
}

/** Persist the language and notify all subscribers. */
export function setLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // localStorage not available (private browsing, etc.)
  }
  listeners.forEach((listener) => listener(language));
}

/** Subscribe to language changes. Returns an unsubscribe function. */
export function onLanguageChange(callback: (language: Language) => void): () => void {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}
