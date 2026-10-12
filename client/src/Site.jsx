import { useState } from 'react';

import Intro from './components/Intro.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Marquee from './components/Marquee.jsx';

import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Stack from './sections/Stack.jsx';
import Work from './sections/Work.jsx';
import Architecture from './sections/Architecture.jsx';
import MoreWork from './sections/MoreWork.jsx';
import Journey from './sections/Journey.jsx';
import Achievements from './sections/Achievements.jsx';
import Beyond from './sections/Beyond.jsx';
import Education from './sections/Education.jsx';
import Certification from './sections/Certification.jsx';
import Contact from './sections/Contact.jsx';

import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useInteractions } from './hooks/useInteractions.js';

/**
 * The public site.
 *
 * Hooks own all the imperative work (scrolling, GSAP effects) so this
 * component stays purely declarative. `ready` gates the hero so its entrance
 * animation doesn't start underneath the intro overlay.
 */
export default function Site() {
  const [ready, setReady] = useState(false);

  useSmoothScroll();
  useInteractions();

  return (
    <>
      <Intro onDone={() => setReady(true)} />
      <Cursor />
      <Nav />

      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Stack />
        <Work />
        <Architecture />
        <MoreWork />
        <Journey />
        <Achievements />
        <Beyond />
        <Education />
        <Certification />
        <Contact />
      </main>
    </>
  );
}
