import './Profile.css';

import { Fragment } from 'react';
import { Transition } from 'react-transition-group';
import { Section } from '../../components/Section';
import { reflow } from '../../utils/transition';
import { Heading } from '../../components/Heading';
import { DecoderText } from '../../components/DecoderText';
import { Text } from '../../components/Text';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';

const ProfileText = ({ status, titleId }) => (
  <Fragment>
    <Heading className="profile__title" data-status={status} level={3} id={titleId}>
      <DecoderText text="Hello, World!" start={status !== 'exited'} delay={500} />
    </Heading>
    <Text className="profile__description" data-status={status} size="l">
      I’m Kiruba, A Passionate and Curious being about all things Web technology. I live
      in Newcastle Upon Tyne and currently studying MSc in Computer Science at{' '}
      <Link href="https://www.sunderland.ac.uk/">University of sunderland</Link>. Love
      Working with teams to build creative and user friendly interfaces to create
      memorable user experiences.
    </Text>
    <Text className="profile__description" data-status={status} size="l">
      When I am not building and Learning new technologies, I love to travel and dance
      Salsa & Bachata with the wonderful Latin dance community around the world.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const titleId = `${id}-title`;

  return (
    <Section
      className="profile"
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0} onEnter={reflow}>
        {status => (
          <div className="profile__content">
            <div className="profile__column">
              <ProfileText status={status} titleId={titleId} />
              <Button
                secondary
                className="profile__button"
                data-status={status}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className="profile__column">
              <div className="profile__tag" aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={status !== 'entered'}
                  collapseDelay={1000}
                />
                <div className="profile__tag-text" data-status={status}>
                  About Me
                </div>
              </div>
              <div className="profile__image-wrapper"></div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
