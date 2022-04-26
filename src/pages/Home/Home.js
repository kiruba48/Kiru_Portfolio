import './Home.css';

import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import BachaFuriaTextureLarge from '../../assets/BachaFuria-Dark-large.jpg';
import BachaFuriaTextureRegisterPage from '../../assets/BachaFuria-register-page.jpg';
import BachaFuriaTextureClassesSection from '../../assets/BachaFuria-classes-section.jpg';
import BachaFuriaTextureContactPage from '../../assets/BachaFuria-contact-page.jpg';

import HempireHomepage from '../../assets/Hempire-homepage.jpg';
import HempireCart from '../../assets/Hempire-cart.jpg';
import HempireAuth from '../../assets/Hempire-Auth.jpg';
import HempireShop from '../../assets/Hempire-shop.jpg';
import HempirePayment from '../../assets/Hempire-payment.jpg';
import HempireAdminUsers from '../../assets/Hempire-Admin-users.jpg';
import HempireAdminOrders from '../../assets/Hempire-Admin-orders.jpg';

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useRouteTransition } from '../../hooks/useRouteTransition';
import { Intro } from './Intro';
import { ProjectSummary } from './ProjectSummary';
import { Profile } from './Profile';
import { Footer } from '../../components/Footer';

const disciplines = [
  'JavaScript',
  'React',
  'TypeScript',
  'Node',
  'Python',
  'Dbms',
  'ThreeJs',
];

export const Home = () => {
  const { status } = useRouteTransition();
  const { hash, state } = useLocation();
  const initHash = useRef(true);
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  // const projectThree = useRef();
  const details = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const revealSections = [intro, projectOne, projectTwo, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  useEffect(() => {
    const hasEntered = status === 'entered';
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    let scrollObserver;
    let scrollTimeout;

    const handleHashchange = (hash, scroll) => {
      clearTimeout(scrollTimeout);
      const hashSections = [intro, projectOne, details];
      const hashString = hash.replace('#', '');
      const element = hashSections.filter(item => item.current.id === hashString)[0];
      if (!element) return;
      const behavior = scroll && !prefersReducedMotion ? 'smooth' : 'instant';
      const top = element.current.offsetTop;

      scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            scrollTimeout = setTimeout(
              () => {
                element.current.focus();
              },
              prefersReducedMotion ? 0 : 400
            );
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '-20% 0px -20% 0px' }
      );
      scrollObserver.observe(element.current);
      if (supportsNativeSmoothScroll) {
        window.scroll({
          top,
          left: 0,
          behavior,
        });
      } else {
        window.scrollTo(0, top);
      }
    };

    if (hash && initHash.current && hasEntered) {
      handleHashchange(hash, false);
      initHash.current = false;
    } else if (!hash && initHash.current && hasEntered) {
      window.scrollTo(0, 0);
      initHash.current = false;
    } else if (hasEntered) {
      handleHashchange(hash, true);
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
    };
  }, [hash, state, prefersReducedMotion, status]);

  return (
    <div className="home">
      <Helmet>
        <title>Kiruba MuthuPalani | Developer</title>
        <meta
          name="description"
          content="Portfolio of Kiruba MuthuPalani – a digital developer working on web &amp; mobile
          apps with a focus on motion and user experience design."
        />
      </Helmet>
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="BachaFuria: North East's Favorite Dance Community"
        description="Design and Development, Built using: JavaScript, Sass, GSAP, Barba.js"
        buttonText="View Website"
        buttonLink="https://bachafuria.netlify.app/"
        images={[
          {
            src: { src: `${BachaFuriaTextureLarge}`, width: 1600 },
            alt: 'BachaFuria Website homepage',
          },
          {
            src: { src: `${BachaFuriaTextureRegisterPage}`, width: 1600 },
            alt: 'BachaFuria Register Interest page ',
          },
          {
            src: { src: `${BachaFuriaTextureClassesSection}`, width: 1600 },
            alt: 'BachaFuria classes section',
          },
          {
            src: { src: `${BachaFuriaTextureContactPage}`, width: 1600 },
            alt: 'BachaFuria contact page ',
          },
        ]}
      />

      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="MERN Stack E-commerce Application"
        description="Design and development, Built using React, Redux, Bootstrap, Node/Express, MongoDb "
        buttonText="View Website"
        buttonLink="https://hempire.herokuapp.com/"
        images={[
          {
            src: { src: `${HempireHomepage}`, width: 1600 },
            alt: 'Hempire Website homepage',
          },
          {
            src: { src: `${HempireAuth}`, width: 1600 },
            alt: 'Hempire Auth page ',
          },
          {
            src: { src: `${HempireShop}`, width: 1600 },
            alt: 'Hempire shop section',
          },
          {
            src: { src: `${HempireCart}`, width: 1600 },
            alt: 'Hempire Cart section ',
          },
          {
            src: { src: `${HempirePayment}`, width: 1600 },
            alt: 'Hempire Payment page ',
          },
          {
            src: { src: `${HempireAdminUsers}`, width: 1600 },
            alt: 'Hempire Admin login users page ',
          },
          {
            src: { src: `${HempireAdminOrders}`, width: 1600 },
            alt: 'Hempire Admin login orders page ',
          },
        ]}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
