import React, { useRef, useEffect, useState } from 'react';

interface HTMLIframeProps {
  html: string;
  title?: string;
}

export default function HTMLIframe({ html, title = 'HTML Content' }: HTMLIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Write HTML content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Auto-resize iframe based on content height
      const resizeIframe = () => {
        try {
          const body = iframeDoc.body;
          const html = iframeDoc.documentElement;
          const contentHeight = Math.max(
            body?.scrollHeight || 0,
            body?.offsetHeight || 0,
            html?.clientHeight || 0,
            html?.scrollHeight || 0,
            html?.offsetHeight || 0,
          );
          if (contentHeight > 0) {
            setHeight(Math.min(contentHeight + 20, 400));
          }
        } catch (error) {
          // Cross-origin or security error - use default height
          console.warn('Unable to resize iframe:', error);
        }
      };

      // Resize after content loads
      setTimeout(resizeIframe, 100);
      setTimeout(resizeIframe, 500);

      // Listen for window resize in iframe
      iframe.contentWindow?.addEventListener('resize', resizeIframe);

      return () => {
        iframe.contentWindow?.removeEventListener('resize', resizeIframe);
      };
    }
  }, [html]);

  return (
    <div className="my-2">
      <iframe
        ref={iframeRef}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="w-full rounded-lg border border-border-medium bg-white dark:bg-gray-800"
        style={{
          height: `${height}px`,
          minHeight: '200px',
        }}
      />
    </div>
  );
}
