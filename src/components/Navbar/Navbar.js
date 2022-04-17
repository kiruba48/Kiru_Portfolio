import './Navbar.css';

import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import { Monogram } from '../Monogram/Monogram';
import { Icon } from '../Icon';
import { tokens } from '../ThemeProvider/theme';
import { media, msToNum, numToMs } from '../../utils/style';
import { useAppContext } from '../../hooks/useAppContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import { NavToggle } from './NavToggle';
import { navLinks, socialLinks } from './navData';
import { reflow } from '../../utils/transition';
import { ThemeToggle } from './ThemeToggle';

//Navbar Icons
const NavbarIcons = () => (
  <div className="navbar__nav-icons">
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        className="navbar__nav-icon-link"
        aria-label={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className="navbar__nav-icon" icon={icon} />
      </a>
    ))}
  </div>
);

export function Navbar(props) {
  const { menuOpen, dispatch } = useAppContext();
  const { location } = props;
  const windowSize = useWindowSize();
  const headerRef = useRef();
  const [hashKey, setHashKey] = useState();
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696;

  const handleNavClick = () => {
    setHashKey(Math.random().toString(32).substring(2, 8));
  };

  const handleMobileNavClick = () => {
    handleNavClick();
    if (menuOpen) dispatch({ type: 'toggleMenu' });
  };

  const isMatch = (url = '', hash = '') => {
    if (!url) return false;
    return `${url}${hash}` === `${location.pathname}${location.hash}`;
  };

  return (
    <header className="navbar" ref={headerRef}>
      <RouterLink
        className="navbar__logo"
        to={{ pathname: '/', hash: '#intro', state: hashKey }}
        aria-label="Kiruba, Developer"
        onClick={handleMobileNavClick}
      >
        <Monogram highlight />
      </RouterLink>

      <NavToggle onClick={() => dispatch({ type: 'toggleMenu' })} menuOpen={menuOpen} />

      <nav className="navbar__nav">
        <div className="navbar__nav-list">
          {navLinks.map(({ label, pathname, hash }) => (
            <RouterLink
              className="navbar__nav-link"
              aria-current={isMatch(pathname, hash) ? 'page' : undefined}
              onClick={handleNavClick}
              key={label}
              to={{ pathname, hash, state: hashKey }}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        <NavbarIcons />
      </nav>

      <Transition
        mountOnEnter
        unmountOnExit
        in={menuOpen}
        timeout={{ enter: 0, exit: msToNum(tokens.base.durationL) }}
        onEnter={reflow}
      >
        {status => (
          <nav className="navbar__mobile-nav" data-status={status}>
            {navLinks.map(({ label, pathname, hash }, index) => (
              <RouterLink
                className="navbar__mobile-nav-link"
                data-status={status}
                aria-current={isMatch(pathname, hash) ? 'page' : undefined}
                key={label}
                onClick={handleMobileNavClick}
                to={{ pathname, hash, state: hashKey }}
                style={{
                  transitionDelay: numToMs(
                    Number(msToNum(tokens.base.durationS)) + index * 50
                  ),
                }}
              >
                {label}
              </RouterLink>
            ))}
            <NavbarIcons />
            <ThemeToggle isMobile />
          </nav>
        )}
      </Transition>
      {!isMobile && <ThemeToggle />}
    </header>
  );
}
