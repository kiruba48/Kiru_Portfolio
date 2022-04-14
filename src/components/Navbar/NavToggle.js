import './NavToggle.css';

import { Button } from '../Button';
import { Icon } from '../Icon';

export const NavToggle = ({ menuOpen, ...rest }) => {
  return (
    <Button
      iconOnly
      className="nav-toggle"
      aria-label="Menu"
      aria-expanded={menuOpen}
      {...rest}
    >
      <div className="nav-toggle__inner">
        <Icon
          className="nav-toggle__icon"
          data-menu={true}
          data-open={menuOpen}
          icon="menu"
        />
        <Icon
          className="nav-toggle__icon"
          data-close={true}
          data-open={menuOpen}
          icon="close"
        />
      </div>
    </Button>
  );
};
