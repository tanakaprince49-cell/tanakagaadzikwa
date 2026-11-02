import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Eye, 
  Edit3, 
  Sparkles, 
  Check, 
  AlertCircle,
  Clock,
  User,
  Tag,
  Bold,
  Italic,
  Heading2,
  Quote,
  List
} from 'lucide-react';
import { BlogPost } from '../types';
import { PRESET_COVER_IMAGES, saveNewBlog, calculateReadTime } from '../data/blogsData';

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished: (post: BlogPost) => void;
}

const CATEGORIES = [
  'Community Stories',
  'Building in Public',
  'AI & Software',
  'Entrepreneurship',
  'Building from Zimbabwe',
  'Product Development',
  'Design & Code',
];

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({ isOpen, onClose, onPublished }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState(PRESET_COVER_IMAGES[0].url);
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('Community, Tech, Startups');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size is too large (maximum 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImageUrl(result);
        setErrorMessage(null);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an image URL.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setErrorMessage('Image URL must start with https://');
      return;
    }
    setImageUrl(trimmed);
    setErrorMessage(null);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your blog post.');
      return;
    }

    if (!body.trim() || body.trim().length < 40) {
      setErrorMessage('Please write a substantive story or lesson (at least 40 characters).');
      return;
    }

    if (!imageUrl) {
      setErrorMessage('Please provide a cover picture for your blog.');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = saveNewBlog({
        title,
        body,
        imageUrl,
        author: author || 'Community Builder',
        authorRole: authorRole || 'Contributor',
        category,
        tags: parsedTags,
      });

      setIsSubmitting(false);
      onPublished(created);
      onClose();
    } catch (err) {
      console.error('Failed to publish', err);
      setErrorMessage('An error occurred while saving the blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const estimatedRead = calculateReadTime(body);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0D1527] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B]/80 bg-[#090E1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-white">
                Publish a Story on TanakaGaadzikwa.com
              </h2>
              <p className="text-xs text-zinc-400">
                Open to all builders, founders, engineers, and creators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-[#131D33] p-1 rounded-xl border border-[#1E293B]">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'write' 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'write' ? (
            <form id="write-blog-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Blog Title <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How I Built an Offline-First AI App from Harare"
                  className="w-full px-4 py-3 text-base sm:text-lg font-serif bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  required
                />
              </div>

              {/* Author & Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Your Name / Pseudonym</span>
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Tanaka, Alex M., or Anonym"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Your Role / Tagline
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Solo Developer, Student, AI Enthusiast"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70"
                  />
                </div>
              </div>

              {/* Category & Tags Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Category <span className="text-sky-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white focus:outline-none focus:border-sky-500/70 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0D1527] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tags (Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Startups, Python, AI, Zimbabwe"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70"
                  />
                </div>
              </div>

              {/* Picture / Cover Image Selector */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#090E1A] border border-[#1E293B]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <span>Cover Picture <span className="text-sky-400">*</span></span>
                  </label>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-[#131D33] p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        imageMode === 'upload' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('presets')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        imageMode === 'presets' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Presets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        imageMode === 'url' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>URL</span>
                    </button>
                  </div>
                </div>

                {/* Mode 1: File Upload */}
                {imageMode === 'upload' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-sky-400 bg-sky-950/20' 
                        : 'border-[#1E293B] hover:border-sky-500/50 bg-[#111A2E]/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Upload className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs sm:text-sm font-medium text-white">
                      Click to choose an image or drag & drop here
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                )}

                {/* Mode 2: Presets */}
                {imageMode === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {PRESET_COVER_IMAGES.map((preset) => {
                      const isSelected = imageUrl === preset.url;
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`relative group rounded-xl overflow-hidden border text-left aspect-video transition-all ${
                            isSelected 
                              ? 'border-sky-400 ring-2 ring-sky-400/30 scale-[1.02]' 
                              : 'border-[#1E293B] hover:border-white/30 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.label} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                            <span className="text-[10px] font-medium text-white line-clamp-1">
                              {preset.label}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Mode 3: Direct URL */}
                {imageMode === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-2 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Image Preview Thumbnail */}
                {imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-[#1E293B] aspect-[21/9] sm:aspect-[24/8] mt-2">
                    <img 
                      src={imageUrl} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-3 text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      Cover Picture Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Body Textarea with Markdown Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Story Body <span className="text-sky-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                    <span>{wordCount} words</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <Clock className="w-3 h-3" />
                      {estimatedRead}
                    </span>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 p-1 bg-[#090E1A] border border-[#1E293B] rounded-t-xl text-zinc-400">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Bold (**text**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Italic (*text*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ', '')}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Subheading (### Heading)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ', '')}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Quote (> Quote)"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ', '')}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                    title="Bullet List (- Item)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-zinc-500 ml-auto pr-2">
                    Supports Markdown paragraphs & quotes
                  </span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  placeholder="Share your story, your development breakdown, lessons from launching, or startup insights here..."
                  className="w-full px-4 py-3.5 text-sm sm:text-base bg-[#111A2E] border border-t-0 border-[#1E293B] rounded-b-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/50 leading-relaxed font-sans resize-y"
                  required
                />
              </div>

            </form>
          ) : (
            /* Live Preview Tab */
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="rounded-2xl overflow-hidden border border-[#1E293B] bg-[#090E1A]">
                {/* Hero cover image */}
                <div className="relative aspect-[21/9] w-full overflow-hidden">
                  <img
                    src={imageUrl || PRESET_COVER_IMAGES[0].url}
                    alt={title || 'Blog Preview'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090E1A] via-transparent to-transparent" />
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Category and Read time */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {estimatedRead}
                    </span>
                    <span className="text-xs text-zinc-500">· Just now</span>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                    {title || 'Untitled Blog Post'}
                  </h1>

                  {/* Author Meta */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[#1E293B]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {(author || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {author || 'Community Builder'}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {authorRole || 'Contributor'}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pt-4 space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed border-t border-[#1E293B]">
                    {body ? (
                      body.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="font-serif text-xl text-white pt-2 font-semibold">
                              {paragraph.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith('> ')) {
                          return (
                            <blockquote key={idx} className="border-l-4 border-sky-400 pl-4 py-1 italic text-zinc-200 bg-sky-950/20 rounded-r-lg">
                              {paragraph.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        if (paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n- ');
                          return (
                            <ul key={idx} className="list-disc pl-5 space-y-1 text-zinc-300">
                              {items.map((item, i) => (
                                <li key={i}>{item.replace(/^- /, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={idx}>{paragraph}</p>;
                      })
                    ) : (
                      <p className="text-zinc-500 italic">No body content written yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E293B]/80 bg-[#090E1A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'write' ? (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                Preview Story
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className="px-4 py-2 text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                Back to Edit
              </button>
            )}

            <button
              type="submit"
              form="write-blog-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <span>Publish Story</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
