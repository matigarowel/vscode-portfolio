'use client';

import {
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';

import styles from '@/styles/Chat.module.css';

interface Props {
  content: string;
}

interface CodeElementProps {
  className?: string;
  children?: ReactNode;
}

function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [themeRevision, setThemeRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const rootStyles = getComputedStyle(document.documentElement);
    const textColor = rootStyles.getPropertyValue('--text-color').trim() || '#070000';
    const mainBackground =
      rootStyles.getPropertyValue('--main-bg').trim() || '#24292e';
    const cardBackground =
      rootStyles.getPropertyValue('--explorer-bg').trim() || mainBackground;
    const accentColor =
      rootStyles.getPropertyValue('--accent-color').trim() || textColor;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        darkMode: false,
        background: mainBackground,
        primaryColor: cardBackground,
        primaryTextColor: textColor,
        primaryBorderColor: accentColor,
        lineColor: accentColor,
        secondaryColor: mainBackground,
        secondaryTextColor: textColor,
        secondaryBorderColor: accentColor,
        tertiaryColor: cardBackground,
        tertiaryTextColor: textColor,
        tertiaryBorderColor: accentColor,
        mainBkg: cardBackground,
        mainColor: textColor,
        nodeBorder: accentColor,
        clusterBkg: mainBackground,
        clusterBorder: accentColor,
        titleColor: textColor,
        edgeLabelBackground: mainBackground,
        actorBkg: cardBackground,
        actorTextColor: textColor,
        actorBorder: accentColor,
        signalColor: accentColor,
        signalTextColor: textColor,
        labelBoxBkgColor: cardBackground,
        labelBoxBorderColor: accentColor,
        labelTextColor: textColor,
        loopTextColor: textColor,
        noteBkgColor: mainBackground,
        noteTextColor: textColor,
        noteBorderColor: accentColor,
        taskTextColor: textColor,
        textColor,
      },
    });

    mermaid
      .render(`${id}-${themeRevision}`, chart)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) setSvg(renderedSvg);
      })
      .catch((renderError: unknown) => {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : 'Could not render this Mermaid diagram.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id, themeRevision]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeRevision((revision) => revision + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div className={styles.diagramError} role="alert">
        <p>Could not render Mermaid diagram: {error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  return svg ? (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <p className={styles.diagramLoading}>Rendering diagram…</p>
  );
}

function MermaidBlock({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className={styles.diagram}>
        <div className={styles.diagramToolbar}>
          <span>Mermaid diagram</span>
          <button
            className={styles.diagramButton}
            type="button"
            onClick={() => dialogRef.current?.showModal()}
          >
            View larger
          </button>
        </div>
        <div className={styles.diagramPreview} role="img" aria-label="Mermaid diagram">
          <MermaidDiagram chart={chart} id={id} />
        </div>
      </div>

      <dialog
        className={styles.diagramDialog}
        ref={dialogRef}
        aria-label="Expanded Mermaid diagram"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
      >
        <div className={styles.dialogHeader}>
          <span>Mermaid diagram</span>
          <button
            className={styles.diagramButton}
            type="button"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            Close
          </button>
        </div>
        <div className={styles.diagramExpanded} role="img" aria-label="Expanded Mermaid diagram">
          <MermaidDiagram chart={chart} id={`${id}-expanded`} />
        </div>
      </dialog>
    </>
  );
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copyStatus, setCopyStatus] = useState('');

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{language}</span>
        <button
          className={styles.copyButton}
          type="button"
          onClick={copyCode}
          aria-label={`Copy ${language} code`}
        >
          {copyStatus || 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '12px',
          background: 'transparent',
          fontSize: '0.8rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownMessage({ content }: Props) {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            if (isValidElement<CodeElementProps>(children)) {
              const { className, children: codeChildren } = children.props;
              const language = /language-([\w+-]+)/.exec(className ?? '')?.[1];
              const code = String(codeChildren).replace(/\n$/, '');

              if (language === 'mermaid') {
                return <MermaidBlock chart={code} />;
              }

              const normalizedLanguage =
                language === 'sh' || language === 'shell' || language === 'zsh'
                  ? 'bash'
                  : language === 'ps1'
                    ? 'powershell'
                    : language === 'cmd' || language === 'bat'
                      ? 'batch'
                      : language ?? 'text';

              return (
                <CodeBlock code={code} language={normalizedLanguage} />
              );
            }

            return <pre>{children}</pre>;
          },
          code({ className, children, ...props }) {
            return (
              <code
                className={className ?? styles.inlineCode}
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className={styles.tableWrap}>
                <table>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
