'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Titlebar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import Explorer from '@/components/Explorer';
import Bottombar from '@/components/Bottombar';
import Tabsbar from '@/components/Tabsbar';
import Terminal from '@/components/Terminal';
import CommandPalette from '@/components/CommandPalette';

import styles from '@/styles/Layout.module.css';
import Chat from './Chat';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [explorerWidth, setExplorerWidth] = useState(240);
  const [chatWidth, setChatWidth] = useState(300);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [chordKey, setChordKey] = useState<string | null>(null);
  const resizeRef = useRef<{
    pane: 'explorer' | 'chat';
    startX: number;
  } | null>(null);

  const resizePane = useCallback(
    (pane: 'explorer' | 'chat', delta: number) => {
      const mainWidth =
        document.querySelector<HTMLElement>('[data-main-panel]')?.clientWidth ??
        window.innerWidth;
      const minimumWidth = pane === 'explorer' ? 150 : 220;
      const otherPanelWidth = pane === 'explorer' ? chatWidth : explorerWidth;
      const maximumWidth = Math.max(
        minimumWidth,
        Math.min(420, mainWidth - otherPanelWidth - 320),
      );
      const setWidth = pane === 'explorer' ? setExplorerWidth : setChatWidth;
      const currentWidth = pane === 'explorer' ? explorerWidth : chatWidth;

      setWidth(Math.min(maximumWidth, Math.max(minimumWidth, currentWidth + delta)));
    },
    [chatWidth, explorerWidth],
  );

  const startResize = (
    event: React.PointerEvent<HTMLDivElement>,
    pane: 'explorer' | 'chat',
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      pane,
      startX: event.clientX,
    };
  };

  const continueResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const delta = event.clientX - resize.startX;
    resizeRef.current = { ...resize, startX: event.clientX };
    resizePane(resize.pane, resize.pane === 'explorer' ? delta : -delta);
  };

  const stopResize = () => {
    resizeRef.current = null;
  };

  const handleResizeKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    pane: 'explorer' | 'chat',
  ) => {
    const step = event.shiftKey ? 24 : 8;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      resizePane(pane, pane === 'explorer' ? direction * step : -direction * step);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const minimumWidth = pane === 'explorer' ? 150 : 220;
      const setWidth = pane === 'explorer' ? setExplorerWidth : setChatWidth;
      if (event.key === 'Home') {
        setWidth(minimumWidth);
      } else {
        const mainWidth =
          document.querySelector<HTMLElement>('[data-main-panel]')?.clientWidth ??
          window.innerWidth;
        const otherPanelWidth = pane === 'explorer' ? chatWidth : explorerWidth;
        setWidth(Math.max(minimumWidth, Math.min(420, mainWidth - otherPanelWidth - 320)));
      }
    }
  };

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev);
  }, []);

  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  useEffect(() => {
    const main = document.getElementById('main-editor');
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    const navigationRoutes: Record<string, string> = {
      'h': '/',
      'a': '/about',
      'p': '/projects',
      'r': '/articles',
      'c': '/contact',
      'g': '/github',
      's': '/settings',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandPaletteOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      const key = e.key.toLowerCase();

      if (chordKey === 'g' && navigationRoutes[key]) {
        e.preventDefault();
        router.push(navigationRoutes[key]);
        setChordKey(null);
        return;
      }

      if (chordKey === 'k' && key === 't') {
        e.preventDefault();
        openCommandPalette();
        setChordKey(null);
        return;
      }

      if ((key === 'g' || key === 'k') && !(e.target instanceof Element && e.target.closest('input, textarea'))) {
        e.preventDefault();
        setChordKey(key);
        setTimeout(() => setChordKey(null), 2000);
        return;
      }

      if (chordKey && key !== chordKey) {
        setChordKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal, openCommandPalette, chordKey, router, isCommandPaletteOpen]);

  return (
    <div className={styles.layout}>
      <Titlebar onOpenCommandPalette={openCommandPalette} />
      <div className={styles.main} data-main-panel>
        <Sidebar />
        <div className={styles.explorerPane} style={{ width: explorerWidth }}>
          <Explorer />
        </div>
        <div
          className={styles.splitter}
          role="separator"
          aria-label="Resize Explorer"
          aria-orientation="vertical"
          aria-valuenow={explorerWidth}
          aria-valuemin={150}
          aria-valuemax={420}
          tabIndex={0}
          onPointerDown={(event) => startResize(event, 'explorer')}
          onPointerMove={continueResize}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          onKeyDown={(event) => handleResizeKeyDown(event, 'explorer')}
        />
        <div className={styles.editorContainer}>
          <Tabsbar />
          <div className={styles.editorWithTerminal}>
            <main id="main-editor" className={styles.content}>
              {children}
            </main>
            {isTerminalOpen && <Terminal onToggle={toggleTerminal} />}
          </div>
        </div>
        <div
          className={`${styles.splitter} ${styles.chatSplitter}`}
          role="separator"
          aria-label="Resize chat"
          aria-orientation="vertical"
          aria-valuenow={chatWidth}
          aria-valuemin={220}
          aria-valuemax={420}
          tabIndex={0}
          onPointerDown={(event) => startResize(event, 'chat')}
          onPointerMove={continueResize}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          onKeyDown={(event) => handleResizeKeyDown(event, 'chat')}
        />
        <div className={styles.chatPane} style={{ width: chatWidth }}>
          <Chat />
        </div>
      </div>
      <Bottombar onTerminalToggle={toggleTerminal} isTerminalOpen={isTerminalOpen} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        onToggleTerminal={toggleTerminal}
        isTerminalOpen={isTerminalOpen}
      />
    </div>
  );
};

export default Layout;
