import { DecoderText } from './DecoderText';
import { StoryContainer } from '../../../.storybook/StoryContainer';
import { Heading } from '../Heading';

export default {
  title: 'DecoderText',
  args: {
    text: 'Slick cyberpunk text',
  },
};

export const text = ({ text }) => (
  <StoryContainer>
    <Heading level={3}>
      <DecoderText delay={0} text={text} />
    </Heading>
  </StoryContainer>
);
