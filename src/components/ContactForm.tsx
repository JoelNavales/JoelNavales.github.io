import { useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { AnimatePresence, motion } from 'motion/react';
import { email } from '../data';
import { easeOut } from '../lib/motion';
import { Arrow } from './Icons';

// Submissions go to Formspree (formspree.io/f/xrpervzl), which emails them on.
const FORMSPREE_FORM_ID = 'xrpervzl';

type ContactFields = { name: string; email: string; message: string };

const swap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: easeOut },
};

// The confirmation only mounts once the form has finished leaving, so focus it on arrival:
// keyboard and screen reader users then hear it instead of being dropped at the top of the page.
const focusOnMount = (node: HTMLElement | null) => {
  node?.focus();
};

// Our own starter text for the message; only this, never a visitor's draft, gets replaced.
const starter = (topic?: string) => (topic ? `Hi Joel, I’d like to ask about ${topic}. ` : '');

export default function ContactForm({
  idPrefix = 'contact',
  topic,
  autoFocus = false,
  onSent,
}: {
  // Keeps ids unique when the About page form and the quick form are both in the page.
  idPrefix?: string;
  // A project the visitor asked about: it starts the message and names the email.
  topic?: string;
  // Focus the first field when the form first appears (the quick form, on desktop).
  autoFocus?: boolean;
  // When given, a successful send clears the form and calls this instead of showing the
  // inline thank-you (the quick form closes and confirms with a toast).
  onSent?: () => void;
}) {
  const [state, handleSubmit, reset] = useForm<ContactFields>(FORMSPREE_FORM_ID, {
    data: {
      _subject: topic ? `Re: ${topic}, from your portfolio` : 'New message from your portfolio',
    },
  });
  const form = useRef<HTMLFormElement>(null);
  const prefilled = useRef('');
  const formErrors = state.errors?.getFormErrors() ?? [];

  useEffect(() => {
    const message = form.current?.elements.namedItem('message');
    if (!(message instanceof HTMLTextAreaElement) || message.value !== prefilled.current) return;
    message.value = prefilled.current = starter(topic);
  }, [topic]);

  useEffect(() => {
    if (!state.succeeded || !onSent) return;
    form.current?.reset();
    prefilled.current = '';
    reset();
    onSent();
  }, [state.succeeded, onSent, reset]);

  // `required` lets a field of only spaces through; catch that before it reaches Formspree.
  function submit(event: FormEvent<HTMLFormElement>) {
    const fields = ['name', 'message'].map((name) => event.currentTarget.elements.namedItem(name));
    for (const field of fields) {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) continue;
      field.setCustomValidity(field.value.trim() ? '' : 'Please write something here.');
    }
    if (!event.currentTarget.reportValidity()) {
      event.preventDefault();
      return;
    }
    handleSubmit(event);
  }

  const fieldProps = (field: keyof ContactFields) => {
    const invalid = (state.errors?.getFieldErrors(field).length ?? 0) > 0;
    return {
      id: `${idPrefix}-${field}`,
      name: field,
      required: true,
      // Clears the "only spaces" message from `submit` as soon as the visitor types.
      onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        event.currentTarget.setCustomValidity(''),
      'aria-invalid': invalid || undefined,
      'aria-describedby': invalid ? `${idPrefix}-${field}-error` : undefined,
    };
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.succeeded && !onSent ? (
        <motion.div
          key="thanks"
          className="contact-thanks"
          ref={focusOnMount}
          tabIndex={-1}
          {...swap}
        >
          <h3>Thanks, your message is on its way.</h3>
          <p>I’ll reply to the email address you left.</p>
          <button type="button" className="text-link" onClick={reset}>
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" ref={form} className="contact-form" onSubmit={submit} {...swap}>
          <div className="field">
            <label htmlFor={`${idPrefix}-name`}>Name</label>
            <input {...fieldProps('name')} type="text" autoComplete="name" autoFocus={autoFocus} />
            <ValidationError
              id={`${idPrefix}-name-error`}
              className="field-error"
              field="name"
              prefix="Name"
              errors={state.errors}
            />
          </div>
          <div className="field">
            <label htmlFor={`${idPrefix}-email`}>Email</label>
            <input {...fieldProps('email')} type="email" autoComplete="email" />
            <ValidationError
              id={`${idPrefix}-email-error`}
              className="field-error"
              field="email"
              prefix="Email"
              errors={state.errors}
            />
          </div>
          <div className="field">
            <label htmlFor={`${idPrefix}-message`}>Message</label>
            <textarea {...fieldProps('message')} rows={5} />
            <ValidationError
              id={`${idPrefix}-message-error`}
              className="field-error"
              field="message"
              prefix="Message"
              errors={state.errors}
            />
          </div>
          {/* Hidden from people; bots fill it in, and Formspree drops those submissions. */}
          <input
            className="contact-gotcha"
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
          />
          {formErrors.length > 0 && (
            <p className="form-error" role="alert">
              {formErrors.map((error) => error.message.replace(/[.!?]?$/, '.')).join(' ')} You can
              also email me at <a href={`mailto:${email}`}>{email}</a>.
            </p>
          )}
          <button type="submit" className="button button-dark" disabled={state.submitting}>
            {state.submitting ? 'Sending…' : 'Send message'} <Arrow />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
