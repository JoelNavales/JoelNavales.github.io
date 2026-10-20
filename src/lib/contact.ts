import { createContext, useContext } from 'react';

// Opens the quick message panel from anywhere on the page. A topic (a project's name) prefills
// the message, so "Ask me about this" and the header's "Let's talk" lead to the same form.
export const ContactContext = createContext<(topic?: string) => void>(() => {});

export const useOpenContact = () => useContext(ContactContext);
