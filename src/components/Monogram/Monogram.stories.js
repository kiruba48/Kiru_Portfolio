import { Monogram } from './Monogram';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Monogram',
};

export const monogram = () => (
  <StoryContainer>
    <Monogram highlight />
  </StoryContainer>
);
