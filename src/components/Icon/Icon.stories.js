import { icons, Icon } from './Icon';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Icon',
};

export const Icons = () => {
  return (
    <StoryContainer>
      {Object.keys(icons).map(icon => (
        <Icon key={icon} icon={icon} />
      ))}
    </StoryContainer>
  );
};
