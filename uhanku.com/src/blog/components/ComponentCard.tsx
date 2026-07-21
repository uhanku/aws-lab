import { useState } from 'react';
import type { ReactNode } from 'react';

interface ComponentCardProps {
  children: ReactNode;
  title: string;
  label?: string;
  codeSnippet?: string;
}

export function ComponentCard({
  children,
  title,
  label,
  codeSnippet,
}: ComponentCardProps) {
  const [copied, setCopied] = useState(false);

  async function copySnippet() {
    if (!codeSnippet) return;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(codeSnippet);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = codeSnippet;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <article className="component-card">
      <div className="component-card__top">
        <span>{title}</span>
        {label ? <span>{label}</span> : null}
      </div>
      <div className="component-card__content">{children}</div>
      {codeSnippet ? (
        <div className="component-card__code-wrap">
          <button
            className="component-card__copy"
            type="button"
            onClick={copySnippet}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <pre className="component-card__code">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      ) : null}
    </article>
  );
}
