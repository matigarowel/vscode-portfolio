'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';

import Tab from '@/components/Tab';

import styles from '@/styles/Tabsbar.module.css';

const Tabsbar = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollControls = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    setCanScrollLeft(scroller.scrollLeft > 0);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    updateScrollControls();
    const observer = new ResizeObserver(updateScrollControls);
    observer.observe(scroller);
    observer.observe(track);
    window.addEventListener('resize', updateScrollControls);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollControls);
    };
  }, [updateScrollControls]);

  const scrollTabs = (direction: -1 | 1) => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(160, scroller.clientWidth * 0.7),
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.tabs}>
      {canScrollLeft && (
        <button
          className={styles.scrollButton}
          type="button"
          aria-label="Scroll tabs left"
          onClick={() => scrollTabs(-1)}
        >
          <VscChevronLeft aria-hidden="true" />
        </button>
      )}
      <div
        className={styles.tabScroller}
        ref={scrollRef}
        onScroll={updateScrollControls}
      >
        <div className={styles.tabTrack} ref={trackRef}>
          <Tab icon="/logos/react_icon.svg" filename="home.tsx" path="/" />
          <Tab icon="/logos/html_icon.svg" filename="about.html" path="/about" />
          <Tab icon="/logos/css_icon.svg" filename="contact.css" path="/contact" />
          <Tab icon="/logos/js_icon.svg" filename="projects.js" path="/projects" />
          {/* <Tab
            icon="/logos/json_icon.svg"
            filename="articles.json"
            path="/articles"
          /> */}
          <Tab
            icon="/logos/markdown_icon.svg"
            filename="github.md"
            path="/github"
          />
        </div>
      </div>
      {canScrollRight && (
        <button
          className={styles.scrollButton}
          type="button"
          aria-label="Scroll tabs right"
          onClick={() => scrollTabs(1)}
        >
          <VscChevronRight aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Tabsbar;
