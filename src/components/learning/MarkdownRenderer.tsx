import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CalloutProps {
  type: 'info' | 'warning' | 'tip' | 'note';
  children: ReactNode;
}

function Callout({ type, children }: CalloutProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    tip: Lightbulb,
    note: AlertCircle,
  };
  const colors = {
    info: 'bg-primary/5 border-primary/30 text-foreground',
    warning: 'bg-destructive/5 border-destructive/30 text-foreground',
    tip: 'bg-accent/30 border-accent text-foreground',
    note: 'bg-muted border-border text-foreground',
  };

  const Icon = icons[type] || Info;
  const colorClasses = colors[type] || colors.note;

  return (
    <div className={cn('my-4 p-4 rounded-lg border flex gap-3', colorClasses)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
      <div className="flex-1 [&>p]:mb-0 [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}

// Pre-process content to convert callout syntax to special markers
function preprocessContent(content: string): string {
  // Convert :::type\n content ::: to a parseable format
  const calloutRegex = /:::(info|warning|tip|note)\n([\s\S]*?):::/g;
  
  return content.replace(calloutRegex, (_, type, innerContent) => {
    // Use a special marker that ReactMarkdown will treat as a paragraph
    return `[CALLOUT_START:${type}]\n\n${innerContent.trim()}\n\n[CALLOUT_END]`;
  });
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedContent = preprocessContent(content);

  // Parse content and render with callouts
  const renderContent = () => {
    const parts = processedContent.split(/(\[CALLOUT_START:[a-z]+\]|\[CALLOUT_END\])/);
    const result: ReactNode[] = [];
    let currentCalloutType: string | null = null;
    let calloutContent = '';
    let key = 0;

    for (const part of parts) {
      const startMatch = part.match(/\[CALLOUT_START:([a-z]+)\]/);
      const isEnd = part === '[CALLOUT_END]';

      if (startMatch) {
        currentCalloutType = startMatch[1];
        calloutContent = '';
      } else if (isEnd && currentCalloutType) {
        result.push(
          <Callout key={key++} type={currentCalloutType as CalloutProps['type']}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {calloutContent.trim()}
            </ReactMarkdown>
          </Callout>
        );
        currentCalloutType = null;
      } else if (currentCalloutType) {
        calloutContent += part;
      } else if (part.trim()) {
        result.push(
          <ReactMarkdown
            key={key++}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {part}
          </ReactMarkdown>
        );
      }
    }

    return result;
  };

  return (
    <div className={cn('prose-content', className)}>
      {renderContent()}
    </div>
  );
}

// Shared markdown components
const markdownComponents = {
  // Headings with proper styling
  h1: ({ children }: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="font-serif text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="font-serif text-2xl font-semibold text-foreground mt-8 mb-3 pb-2 border-b border-border">
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }: ComponentPropsWithoutRef<'h4'>) => (
    <h4 className="font-serif text-lg font-medium text-foreground mt-4 mb-2">
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-foreground leading-relaxed mb-4">{children}</p>
  ),

  // Blockquotes
  blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-6 bg-muted/30 rounded-r-lg italic text-muted-foreground">
      {children}
    </blockquote>
  ),

  // Lists
  ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-foreground">{children}</ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground">{children}</ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-foreground leading-relaxed">{children}</li>
  ),

  // Code blocks
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'> & { className?: string }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match && !className;

    if (isInline) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative my-4">
        {match && (
          <div className="absolute top-0 right-0 bg-muted/80 text-muted-foreground text-xs px-2 py-1 rounded-bl font-mono">
            {match[1]}
          </div>
        )}
        <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
          <code className={cn('text-sm font-mono text-foreground', className)} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },

  // Tables
  table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-muted">{children}</thead>
  ),
  th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
    <td className="border border-border px-4 py-2 text-foreground">{children}</td>
  ),
  tr: ({ children }: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="even:bg-muted/30">{children}</tr>
  ),

  // Links
  a: ({ href, children }: ComponentPropsWithoutRef<'a'>) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  // Strong and emphasis
  strong: ({ children }: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: ComponentPropsWithoutRef<'em'>) => (
    <em className="italic text-foreground">{children}</em>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-border" />,
};
