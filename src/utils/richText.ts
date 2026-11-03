/**
 * Shared helpers for the rich-text blog editor.
 *
 * Blog bodies can be stored in two formats:
 *  1. HTML  -> written with the new WYSIWYG editor (bold, links, lists, headings...)
 *  2. Markdown -> legacy posts written with the old textarea editor
 *
 * These helpers detect the format, convert HTML to plain text (for word counts,
 * search, SEO descriptions) and sanitise HTML before it is rendered.
 */

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'DIV', 'SPAN', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'DEL', 'STRIKE',
  'CODE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL',
  'LI', 'A', 'HR', 'IMG', 'FIGURE', 'FIGCAPTION',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(['href', 'target', 'rel', 'title']),
  IMG: new Set(['src', 'alt', 'title', 'width', 'height']),
};

/** True when a body string was produced by the rich (HTML) editor. */
export function looksLikeHtml(value: string): boolean {
  if (!value) return false;
  return /<\/?(p|div|br|span|strong|b|em|i|u|h[1-6]|ul|ol|li|blockquote|a|code|pre|hr|img)\b[^>]*>/i.test(value);
}

/** Strip every tag and decode a few common entities -> plain readable text. */
export function stripHtml(value: string): string {
  if (!value) return '';
  if (!looksLikeHtml(value)) return value;
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|blockquote|pre)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Word count that works for both HTML and markdown bodies. */
export function countWords(value: string): number {
  const text = stripHtml(value).replace(/[#*~`>\[\]()]/g, ' ');
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  return words.length;
}

/** Plain text summary of a body (used for search + SEO cards). */
export function toPlainText(value: string, maxLength?: number): string {
  const text = stripHtml(value)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links
    .replace(/[#*~`>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function safeUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed;
  if (/^javascript:/i.test(trimmed)) return '';
  return `https://${trimmed}`;
}

/**
 * Sanitises rich-text HTML: keeps a small allow-list of formatting tags and
 * attributes, forces safe hrefs and external links to open in a new tab.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html || '';
  }
  // Plain markdown or plain text - nothing to sanitise.
  if (!looksLikeHtml(html)) return html;

  const doc = new DOMParser().parseFromString(`<div id="__root">${html}</div>`, 'text/html');
  const root = doc.getElementById('__root');
  if (!root) return '';

  const walk = (node: Element) => {
    Array.from(node.children).forEach((child) => {
      const tag = child.tagName.toUpperCase();

      if (!ALLOWED_TAGS.has(tag)) {
        // Unwrap unknown but harmless containers, drop dangerous ones entirely.
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'FORM', 'INPUT'].includes(tag)) {
          child.remove();
        } else {
          const parent = child.parentNode;
          if (!parent) return;
          while (child.firstChild) parent.insertBefore(child.firstChild, child);
          child.remove();
        }
        return;
      }

      const allowed = ALLOWED_ATTRS[tag];
      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (!allowed || !allowed.has(name)) {
          child.removeAttribute(attr.name);
        }
      });

      if (tag === 'A') {
        const href = safeUrl(child.getAttribute('href') || '');
        if (!href) {
          child.removeAttribute('href');
        } else {
          child.setAttribute('href', href);
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener noreferrer');
        }
      }

      if (tag === 'IMG') {
        const src = child.getAttribute('src') || '';
        if (!/^(https?:\/\/|data:image\/)/i.test(src)) {
          child.remove();
          return;
        }
        child.setAttribute('alt', child.getAttribute('alt') || '');
      }

      walk(child);
    });
  };

  walk(root);
  return root.innerHTML;
}

/**
 * Repairs the small structural quirks browsers leave behind in contentEditable
 * (stray text nodes at the root, blocks nested inside other blocks, inline
 * styles) so the saved HTML is always valid and renders the same for everyone.
 */
export function normalizeBodyHtml(html: string): string {
  if (!html || typeof window === 'undefined' || typeof DOMParser === 'undefined') return html || '';
  if (!looksLikeHtml(html)) return html;

  const doc = new DOMParser().parseFromString(`<div id="__root">${html}</div>`, 'text/html');
  const root = doc.getElementById('__root');
  if (!root) return html || '';

  const CONTAINER_TAGS = new Set(['P', 'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN']);
  const BLOCK_TAGS = new Set([
    'P', 'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'FIGURE', 'HR', 'TABLE',
  ]);

  /** Flattens a container into an ordered list of top-level blocks. */
  const collect = (container: Element): Element[] => {
    const result: Element[] = [];
    let paragraph: Element | null = null;

    const flushParagraph = () => {
      if (paragraph && (paragraph.textContent?.trim() || paragraph.querySelector('img,br'))) {
        result.push(paragraph);
      }
      paragraph = null;
    };

    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === 1 && BLOCK_TAGS.has((node as Element).tagName)) {
        const el = node as Element;
        if (CONTAINER_TAGS.has(el.tagName)) {
          // Containers can hold other blocks, so recurse and keep the order
          flushParagraph();
          result.push(...collect(el));
        } else {
          flushParagraph();
          result.push(el);
        }
        return;
      }

      if (node.nodeType === 3 && !(node.textContent || '').trim()) {
        // Pure whitespace between blocks can be dropped
        if (!paragraph && result.length === 0) return;
        if (!paragraph) return;
      }

      if (!paragraph) paragraph = doc.createElement('p');
      paragraph.appendChild(node);
    });

    flushParagraph();
    return result;
  };

  const blocks = collect(root);

  // Strip inline styles / empty spans the browser injects while typing
  const clean = doc.createElement('div');
  blocks.forEach((block) => clean.appendChild(block));

  clean.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('id');
    if (el.tagName === 'SPAN' && el.attributes.length === 0) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        el.remove();
      }
    }
  });
  clean.querySelectorAll('span').forEach((el) => {
    if (el.attributes.length === 0) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        el.remove();
      }
    }
  });

  return clean.innerHTML;
}

/** Normalises a URL typed into the link dialog. */
export function normalizeUrl(url: string): string {
  return safeUrl(url);
}
