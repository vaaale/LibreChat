import { useMemo } from 'react';
import type { TAttachment } from 'librechat-data-provider';
import HTMLIframe from './HTMLIframe';

export default function HTMLAttachments({ attachments }: { attachments?: TAttachment[] }) {
  const htmlAttachments = useMemo(() => {
    if (!attachments || attachments.length === 0) {
      return [];
    }

    return attachments.filter((attachment) => attachment.type === 'html_content');
  }, [attachments]);

  if (htmlAttachments.length === 0) {
    return null;
  }

  return (
    <div className="my-2">
      {htmlAttachments.map((attachment, index) => (
        <HTMLIframe
          key={`${attachment.toolCallId}-${index}`}
          html={(attachment as any).html}
          title={(attachment as any).domain || 'HTML Content'}
        />
      ))}
    </div>
  );
}
