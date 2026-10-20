'use client';

import { useEffect } from 'react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

const chatScriptUrl =
  'https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js';

declare module 'react' {
  // React's JSX intrinsic element types require namespace augmentation.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        host_url: string;
        flow_id: string;
        api_key?: string;
      };
    }
  }
}

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget = ({ className }: ChatWidgetProps) => {
  useEffect(() => {
    if (document.querySelector('script[src*="langflow-embedded-chat"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = chatScriptUrl;
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load the Langflow chat widget script.');
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className={className}>
      <langflow-chat
        host_url="http://localhost:37860"
        flow_id="b81e9b6e-babd-4d49-8c64-a8cf352c0f91"
        api_key={process.env.NEXT_PUBLIC_OPENAI_API_KEY}
      />
    </div>
  );
};

export default ChatWidget;
