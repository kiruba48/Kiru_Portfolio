import './Contact.css';

import { useCallback, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { tokens } from '../../components/ThemeProvider/theme';
import { Section } from '../../components/Section';
import { DecoderText } from '../../components/DecoderText';
import { useRouteTransition } from '../../hooks/useRouteTransition';
import { reflow } from '../../utils/transition';
import { Heading } from '../../components/Heading';
import { prerender } from '../../utils/prerender';
import { cssProps, msToNum, numToMs } from '../../utils/style';
import { useFormInput } from '../../hooks/useFormInput';
import { Divider } from '../../components/Divider';
import { Input } from '../../components/Input';
import { isVisible } from '../../utils/transition';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';

const initDelay = tokens.base.durationS;

// function getStatusError({
//   status,
//   errorMessage,
//   fallback = 'There was a problem with your request',
// }) {
//   if (status === 200) return false;

//   const statuses = {
//     500: 'There was a problem with the server, try again later',
//     404: 'There was a problem connecting to the server. Make sure you are connected to the internet',
//   };

//   if (errorMessage) {
//     return errorMessage;
//   }

//   return statuses[status] || fallback;
// }

function getDelay(delayMs, initDelayMs = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(initDelayMs) + numDelay).toFixed(0)) });
}

export const Contact = () => {
  const { status } = useRouteTransition();
  const email = useFormInput('');
  const message = useFormInput('');
  const errorRef = useRef();
  const [sending, setSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [statusError, setStatusError] = useState('');

  const encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  };

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      setStatusError('');

      if (sending) return;

      setSending(true);
      // Netlify form functionality
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          email: email.value,
          message: message.value,
        }),
      })
        .then(() => {
          setComplete(true);
          setSending(false);
        })
        .catch(() => {
          setSending(false);
          setStatusError('There was a problem sending your message');
        });

      // try {
      //   setSending(true);
      //   const response = await fetch('', {
      //     method: 'POST',
      //     mode: 'cors',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       email: email.value,
      //       message: message.value,
      //     }),
      //   });

      //   const responseMessage = await response.json();

      //   const statusError = getStatusError({
      //     status: response?.status,
      //     errorMessage: responseMessage?.error,
      //     fallback: 'There was a problem sending your message',
      //   });

      //   if (statusError) throw new Error(statusError);

      //   setComplete(true);
      //   setSending(false);
      // } catch (error) {
      //   setSending(false);
      //   setStatusError(error.message);
      // }
    },
    [email.value, message.value, sending]
  );

  return (
    <Section className="contact" data-status={status}>
      <meta
        name="Contact"
        content="Feel free to send me a message if you’re interested in discussing a future opportunity or if you just want to say hi"
      />
      <Transition
        in={!complete}
        appear
        mountOnEnter
        unmountOnExit
        timeout={1600}
        onEnter={reflow}
      >
        {status => (
          <form className="contact__form" method="post" onSubmit={onSubmit}>
            <Heading
              className="contact__title"
              data-status={status}
              data-hidden={prerender}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText
                text="Say hello"
                start={status !== 'exited' && !prerender}
                delay={300}
              />
            </Heading>
            <Divider
              className="contact__divider"
              data-status={status}
              data-hidden={prerender}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            <Input
              required
              className="contact__input"
              data-status={status}
              data-hidden={prerender}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your Email"
              type="email"
              name="email"
              maxLength={512}
              {...email}
            />
            <Input
              required
              multiline
              className="contact__input"
              data-status={status}
              data-hidden={prerender}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={4096}
              {...message}
            />
            <Transition in={!!statusError} timeout={msToNum(tokens.base.durationM)}>
              {errorStatus => (
                <div
                  className="contact__form-error"
                  data-status={errorStatus}
                  style={cssProps({
                    height: isVisible(errorStatus)
                      ? errorRef.current?.getBoundingClientRect().height
                      : 0,
                  })}
                >
                  <div className="contact__form-error-content" ref={errorRef}>
                    <div className="contact__form-error-message">
                      <Icon className="contact__form-error-icon" icon="error" />
                      {statusError}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className="contact__button"
              data-status={status}
              data-hidden={prerender}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending}
              loading={sending}
              loadingText="Sending..."
              icon="send"
              type="submit"
            >
              Send Message
            </Button>
          </form>
        )}
      </Transition>
      <Transition
        in={complete}
        appear
        mountOnEnter
        unmountOnExit
        onEnter={reflow}
        timeout={0}
      >
        {status => (
          <div className="contact__complete" aria-live="polite">
            <Heading
              level={3}
              as="h3"
              className="contact__complete-title"
              data-status={status}
            >
              Message Sent
            </Heading>
            <Text
              size="l"
              className="contact__complete-text"
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              Thank You for contacting me. Will get back to you soon.
            </Text>
            <Button
              secondary
              iconHoverShift
              className="contact__complete-button"
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevronRight"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
    </Section>
  );
};
