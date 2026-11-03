import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Unlink,
  Eraser,
  Undo2,
  Redo2,
  Check,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { normalizeUrl, sanitizeHtml } from '../utils/richText';

interface RichTextEditorProps {
  /** HTML (or legacy markdown) value */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

type LinkDialogState = {
  isOpen: boolean;
  url: string;
  text: string;
  hasSelection: boolean;
  error: string | null;
};

const CLOSED_LINK_DIALOG: LinkDialogState = {
  isOpen: false,
  url: '',
  text: '',
  hasSelection: false,
  error: null,
};

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * A dependency-free WYSIWYG editor.
 *
 * Everything is instantaneous: clicking Bold (or pressing Ctrl+B) bolds the
 * highlighted words immediately - no `**markdown**` ever shows up in the text.
 * The same goes for links: highlight any word, hit "Link" (or Ctrl+K), type the
 * address and the highlighted word becomes a real hyperlink.
 */
const EMPTY_PARAGRAPH = '<p><br></p>';

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your story...',
  minHeight = 260,
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastEmittedRef = useRef<string>(value || '');

  const [linkDialog, setLinkDialog] = useState<LinkDialogState>(CLOSED_LINK_DIALOG);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  /* ------------------------------------------------------------------ */
  /* Keep the DOM in sync with external value changes (reset / prefill)  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === lastEmittedRef.current) return;
    if ((el.innerHTML || '') === (value || '')) {
      lastEmittedRef.current = value || '';
      return;
    }
    el.innerHTML = value || EMPTY_PARAGRAPH;
    lastEmittedRef.current = value || '';
    setIsEmpty(!el.textContent?.trim());
  }, [value]);

  /* One-time editor setup */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== (value || '')) el.innerHTML = value || EMPTY_PARAGRAPH;
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
      document.execCommand('styleWithCSS', false, 'false');
    } catch {
      /* older browsers - ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML || '';
    const empty = !el.textContent?.trim() && !el.querySelector('img');
    setIsEmpty(empty);
    lastEmittedRef.current = html;
    onChange(empty ? '' : html);
  }, [onChange]);

  /* ------------------------------------------------------------------ */
  /* Selection bookkeeping                                              */
  /* ------------------------------------------------------------------ */
  const saveSelection = useCallback(() => {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    const range = savedRangeRef.current;
    if (!el) return;
    el.focus();
    if (!range) return;
    if (!el.contains(range.commonAncestorContainer)) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const refreshActiveFormats = useCallback(() => {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0) {
      setActiveFormats({});
      return;
    }
    if (!el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      setActiveFormats({});
      return;
    }
    let block = '';
    try {
      block = (document.queryCommandValue('formatBlock') || '').toLowerCase();
    } catch {
      block = '';
    }
    const state = (cmd: string) => {
      try {
        return document.queryCommandState(cmd);
      } catch {
        return false;
      }
    };
    setActiveFormats({
      bold: state('bold'),
      italic: state('italic'),
      underline: state('underline'),
      strikeThrough: state('strikeThrough'),
      insertUnorderedList: state('insertUnorderedList'),
      insertOrderedList: state('insertOrderedList'),
      h2: block.includes('h2'),
      h3: block.includes('h3'),
      blockquote: block.includes('blockquote'),
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      const el = editorRef.current;
      const sel = window.getSelection();
      if (!el || !sel || sel.rangeCount === 0) return;
      saveSelection();
      refreshActiveFormats();
      // If the caret moved outside the editor, close the link popover.
      if (!el.contains(sel.getRangeAt(0).commonAncestorContainer) && !linkDialog.isOpen) {
        setActiveFormats({});
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [saveSelection, refreshActiveFormats, linkDialog.isOpen]);

  /* ------------------------------------------------------------------ */
  /* Commands                                                           */
  /* ------------------------------------------------------------------ */
  const runCommand = useCallback(
    (command: string, valueArg?: string) => {
      const el = editorRef.current;
      if (!el || disabled) return;
      el.focus();
      restoreSelection();
      if (command === 'formatBlock') {
        let current = '';
        try {
          current = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        } catch {
          current = '';
        }
        // Toggle: clicking the active block style returns to a normal paragraph
        const target = current.includes((valueArg || '').toLowerCase()) ? 'p' : valueArg;
        document.execCommand('formatBlock', false, `<${target}>`);
      } else {
        document.execCommand(command, false, valueArg);
      }
      emitChange();
      saveSelection();
      refreshActiveFormats();
    },
    [disabled, emitChange, refreshActiveFormats, restoreSelection, saveSelection]
  );

  /** Wraps (or unwraps) the current selection in an inline element, e.g. <code>. */
  const wrapSelection = useCallback(
    (tag: 'code' | 'mark') => {
      const el = editorRef.current;
      if (!el || disabled) return;
      el.focus();
      restoreSelection();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (range.collapsed) return;

      // Unwrap when the selection is already inside the same tag
      const anchor = range.commonAncestorContainer;
      const parentTag = (anchor.nodeType === 1 ? (anchor as Element) : anchor.parentElement)?.closest(tag);
      if (parentTag && el.contains(parentTag)) {
        const fragment = document.createDocumentFragment();
        while (parentTag.firstChild) fragment.appendChild(parentTag.firstChild);
        parentTag.replaceWith(fragment);
      } else {
        const wrapper = document.createElement(tag);
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);
        const newRange = document.createRange();
        newRange.selectNodeContents(wrapper);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      }
      emitChange();
      refreshActiveFormats();
    },
    [disabled, emitChange, refreshActiveFormats, restoreSelection]
  );

  /* ------------------------------------------------------------------ */
  /* Link dialog                                                        */
  /* ------------------------------------------------------------------ */
  const openLinkDialog = useCallback(() => {
    const el = editorRef.current;
    if (!el || disabled) return;
    el.focus();
    const sel = window.getSelection();
    const hasSelection = !!sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed;
    saveSelection();

    // Pre-fill from an existing link under the caret, if any
    let existingUrl = '';
    if (sel && sel.rangeCount > 0) {
      const node = sel.getRangeAt(0).commonAncestorContainer;
      const anchorEl = (node.nodeType === 1 ? (node as Element) : node.parentElement)?.closest('a[href]');
      if (anchorEl) existingUrl = anchorEl.getAttribute('href') || '';
    }

    setLinkDialog({
      isOpen: true,
      url: existingUrl,
      text: hasSelection && sel ? sel.toString() : '',
      hasSelection: !!hasSelection,
      error: null,
    });
    setTimeout(() => {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    }, 30);
  }, [disabled, saveSelection]);

  const closeLinkDialog = useCallback(() => {
    setLinkDialog(CLOSED_LINK_DIALOG);
    editorRef.current?.focus();
  }, []);

  const applyLink = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const url = normalizeUrl(linkDialog.url);
    if (!url || url === 'https://' || url === 'http://') {
      setLinkDialog((prev) => ({ ...prev, error: 'Please type a website address, e.g. https://example.com' }));
      linkInputRef.current?.focus();
      return;
    }

    el.focus();
    restoreSelection();
    const sel = window.getSelection();

    const hasUsableSelection =
      !!sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer);

    if (hasUsableSelection && sel && !sel.getRangeAt(0).collapsed) {
      // Highlighted words become the clickable link text (formatting preserved)
      document.execCommand('createLink', false, url);
      // Force links to open in a new tab
      el.querySelectorAll('a[href]').forEach((a) => {
        if (a.getAttribute('href') === url) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }
      });
    } else {
      const label = (linkDialog.text || '').trim() || url.replace(/^https?:\/\//, '');
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>&nbsp;`
      );
    }

    emitChange();
    saveSelection();
    setLinkDialog(CLOSED_LINK_DIALOG);
  }, [emitChange, linkDialog.text, linkDialog.url, restoreSelection, saveSelection]);

  const removeLink = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    document.execCommand('unlink');
    emitChange();
    setLinkDialog(CLOSED_LINK_DIALOG);
  }, [emitChange, restoreSelection]);

  /* ------------------------------------------------------------------ */
  /* Keyboard shortcuts                                                 */
  /* ------------------------------------------------------------------ */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) {
      if (e.key === 'Escape' && linkDialog.isOpen) {
        e.preventDefault();
        closeLinkDialog();
      }
      return;
    }
    const key = e.key.toLowerCase();
    if (key === 'b') {
      e.preventDefault();
      runCommand('bold');
    } else if (key === 'i') {
      e.preventDefault();
      runCommand('italic');
    } else if (key === 'u') {
      e.preventDefault();
      runCommand('underline');
    } else if (key === 'k') {
      e.preventDefault();
      openLinkDialog();
    } else if (e.shiftKey && key === 'x') {
      e.preventDefault();
      runCommand('strikeThrough');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (html) {
      document.execCommand('insertHTML', false, sanitizeHtml(html));
    } else if (text) {
      const safe = text
        .split(/\n{2,}/)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
        .join('');
      document.execCommand('insertHTML', false, safe);
    }
    emitChange();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent dropping files/HTML blobs straight into the document
    if (e.dataTransfer?.files?.length || e.dataTransfer?.types?.includes('text/html')) {
      e.preventDefault();
    }
  };

  const ToolbarButton: React.FC<{
    label: string;
    shortcut?: string;
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    accent?: 'sky';
  }> = ({ label, shortcut, active, onClick, children, accent }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={!!active}
      className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
        active
          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
          : accent === 'sky'
            ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
            : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-1.5 bg-zinc-100 border border-zinc-200 rounded-t-xl">
        <ToolbarButton label="Bold" shortcut="Ctrl+B" active={activeFormats.bold} onClick={() => runCommand('bold')}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Italic" shortcut="Ctrl+I" active={activeFormats.italic} onClick={() => runCommand('italic')}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Underline" shortcut="Ctrl+U" active={activeFormats.underline} onClick={() => runCommand('underline')}>
          <Underline className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          label="Strikethrough"
          shortcut="Ctrl+Shift+X"
          active={activeFormats.strikeThrough}
          onClick={() => runCommand('strikeThrough')}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-0.5" />

        <ToolbarButton label="Subheading" active={activeFormats.h2} onClick={() => runCommand('formatBlock', 'h2')}>
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Small heading" active={activeFormats.h3} onClick={() => runCommand('formatBlock', 'h3')}>
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Quote" active={activeFormats.blockquote} onClick={() => runCommand('formatBlock', 'blockquote')}>
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          label="Bullet list"
          active={activeFormats.insertUnorderedList}
          onClick={() => runCommand('insertUnorderedList')}
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          label="Numbered list"
          active={activeFormats.insertOrderedList}
          onClick={() => runCommand('insertOrderedList')}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Inline code" onClick={() => wrapSelection('code')}>
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-0.5" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkDialog}
          title="Turn the highlighted text into a link (Ctrl+K)"
          className="px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-all cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link</span>
        </button>

        <ToolbarButton label="Remove formatting" onClick={() => runCommand('removeFormat')}>
          <Eraser className="w-3.5 h-3.5" />
        </ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-0.5" />

        <ToolbarButton label="Undo" shortcut="Ctrl+Z" onClick={() => runCommand('undo')}>
          <Undo2 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton label="Redo" shortcut="Ctrl+Y" onClick={() => runCommand('redo')}>
          <Redo2 className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Link popover */}
      {linkDialog.isOpen && (
        <div className="relative">
          <div className="relative z-30 mx-auto w-full sm:w-[26rem] my-2 rounded-2xl border border-sky-200 bg-white shadow-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700">
                <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>{linkDialog.hasSelection ? 'Link highlighted text' : 'Insert link'}</span>
              </div>
              <button
                type="button"
                onClick={closeLinkDialog}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
                aria-label="Close link dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {linkDialog.hasSelection && linkDialog.text && (
              <div className="text-[11px] text-zinc-500 truncate">
                Text: <span className="font-semibold text-zinc-800">“{linkDialog.text}”</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Website address</label>
              <input
                ref={linkInputRef}
                type="text"
                value={linkDialog.url}
                onChange={(e) => setLinkDialog((prev) => ({ ...prev, url: e.target.value, error: null }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeLinkDialog();
                  }
                }}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white"
              />
            </div>

            {!linkDialog.hasSelection && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Text to display (optional)
                </label>
                <input
                  type="text"
                  value={linkDialog.text}
                  onChange={(e) => setLinkDialog((prev) => ({ ...prev, text: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyLink();
                    }
                  }}
                  placeholder="e.g. Read the full story"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>
            )}

            {linkDialog.error && <p className="text-[11px] text-red-600 font-medium">{linkDialog.error}</p>}

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={removeLink}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:text-red-600 flex items-center gap-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                Remove link
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLinkDialog}
                  className="px-3 py-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply
                </button>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 flex items-center gap-1 pt-0.5">
              <CornerDownLeft className="w-3 h-3" />
              Press Enter to apply · Esc to cancel
            </p>
          </div>
        </div>
      )}

      {/* Editable surface */}
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable={!disabled}
        suppressContentEditableWarning
        spellCheck
        data-placeholder={placeholder}
        data-empty={isEmpty ? 'true' : 'false'}
        data-focused={isFocused ? 'true' : 'false'}
        onInput={emitChange}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        onKeyUp={() => {
          saveSelection();
          refreshActiveFormats();
        }}
        onMouseUp={() => {
          saveSelection();
          refreshActiveFormats();
        }}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`rich-editor w-full px-3.5 sm:px-4 py-3 text-sm sm:text-base bg-zinc-50 border border-t-0 border-zinc-200 rounded-b-xl text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 leading-relaxed font-sans overflow-y-auto ${
          isFocused ? 'ring-0' : ''
        }`}
        style={{ minHeight }}
      />
    </div>
  );
};

export default RichTextEditor;
