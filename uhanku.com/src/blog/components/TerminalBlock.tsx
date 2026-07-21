import { useState } from 'react';

interface TerminalBlockProps {
  code: string;
  label?: string;
  language?: string;
  copyable?: boolean;
}

export function TerminalBlock({
  code,
  label = 'TERMINAL',
  language = 'bash',
  copyable = true,
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <div className="terminal-block">
      <div className="console-bar">
        <span>{label}</span>
        <span>{language}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      {copyable ? (
        <button
          className="terminal-block__copy"
          type="button"
          onClick={copyCode}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      ) : null}
    </div>
  );
}
