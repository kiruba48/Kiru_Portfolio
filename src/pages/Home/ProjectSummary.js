import './ProjectSummary.css';

import { useState } from 'react';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { Transition } from 'react-transition-group';
import { media } from '../../utils/style';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Divider } from '../../components/Divider';
// import { useTheme } from '../../components/ThemeProvider';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Carousel } from '../../components/Carousel';
import { reflow } from '../../utils/transition';

export const ProjectSummary = ({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  images,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}) => {
  // const theme = useTheme();
  const titleId = `${id}-title`;
  const [focused, setFocused] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= media.tablet;
  const indexText = index < 10 ? `0${index}` : index;

  const renderDetails = status => {
    return (
      <div className="project-summary__details">
        <div aria-hidden className="project-summary__index">
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={status !== 'entered'}
            collapseDelay={1000}
          />
          <span className="project-summary__index-number" data-status={status}>
            {indexText}
          </span>
        </div>
        <Heading
          level={3}
          as="h2"
          className="project-summary__title"
          data-status={status}
          id={titleId}
        >
          {title}
        </Heading>
        <Text className="project-summary__description" data-status={status}>
          {description}
        </Text>
        <div className="project-summary__button" data-status={status}>
          <Button iconHoverShift href={buttonLink} iconEnd="arrowRight">
            {buttonText}
          </Button>
        </div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="project-summary__preview">
      <Carousel
        style={{ maxWidth: 800, width: '100%' }}
        images={images}
        width={1920}
        height={1400}
      />
      ;
    </div>
  );

  return (
    <Section
      className="project-summary"
      data-alternate={alternate}
      data-first={index === '01'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className="project-summary__content">
        <Transition in={sectionVisible || focused} timeout={0} onEnter={reflow}>
          {status => (
            <>
              {!alternate && !isMobile && (
                <>
                  {renderDetails(status)}
                  {renderPreview()}
                </>
              )}
              {(alternate || isMobile) && (
                <>
                  {renderPreview()}
                  {renderDetails(status)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
};
