import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  ImageIcon, 
  Eye, 
  Edit3, 
  AlertCircle,
  Clock,
  Bold,
  Italic,
  Heading2,
  Quote,
  List,
  Lock,
  Sparkles,
  Link as LinkIcon,
  Crop,
  Code,
  Strikethrough
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { saveNewBlog, calculateReadTime, PRESET_COVER_IMAGES } from '../data/blogsData';
import { compressImageFile } from '../utils/imageCompressor';
import { ImageCropperModal } from './ImageCropperModal';

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished: (post: BlogPost) => void;
  currentUser: UserProfile | null;
  onRequireAuth: () => void;
}

const CATEGORIES = [
  'General',
  'Software Development',
  'Artificial Intelligence',
  'Entrepreneurship',
  'Building in Public',
  'Building from Zimbabwe',
  'Product & Design',
];

export const renderInlineFormatting = (text: string) => {
  if (!text) return null;

  // Regex matches:
  // 1. Markdown link: \[([^\]]+)\]\(([^)]+)\)
  // 2. Bold: \*\*([^*]+)\*\*
  // 3. Italic: \*([^*]+)\*
  // 4. Strikethrough: ~([^~]+)~
  // 5. Code: `([^`]+)`
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|~[^~]+~|`[^`]+`)/g;
  const parts = text.split(regex);

  const formatted = parts.map((part, i) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      let linkUrl = linkMatch[2].trim();
      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://') && !linkUrl.startsWith('mailto:')) {
        linkUrl = `https://${linkUrl}`;
      }
      return (
        <a
          key={`link-${i}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:text-sky-800 underline font-medium transition-colors cursor-pointer inline"
          onClick={(e) => e.stopPropagation()}
        >
          {linkText}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={`b-${i}`} className="font-bold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={`i-${i}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Strikethrough: ~text~
    if (part.startsWith('~') && part.endsWith('~') && part.length >= 2) {
      return (
        <del key={`del-${i}`} className="line-through text-zinc-500">
          {part.slice(1, -1)}
        </del>
      );
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={`code-${i}`} className="px-1.5 py-0.5 bg-zinc-100 text-pink-600 rounded font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={`t-${i}`}>{part}</React.Fragment>;
  }).filter(Boolean);

  return formatted.length > 0 ? formatted : null;
};

export const renderFormattedBody = (bodyText: string) => {
  if (!bodyText) return null;

  const blocks = bodyText
    .split(/\n\s*\n/)
    .map((paragraph, idx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={`h3-${idx}`} className="font-serif text-xl sm:text-2xl text-zinc-900 pt-3 pb-1 font-semibold">
            {renderInlineFormatting(trimmed.replace('### ', ''))}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={`bq-${idx}`} 
            className="border-l-4 border-zinc-900 pl-4 py-1 italic text-zinc-700 bg-zinc-50 rounded-r-xl my-2"
          >
            {renderInlineFormatting(trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, ''))}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n- ');
        return (
          <ul key={`ul-${idx}`} className="space-y-1.5 pl-6 list-disc text-zinc-800 my-3">
            {items.map((item, i) => (
              <li key={`li-${idx}-${i}`}>{renderInlineFormatting(item.replace(/^- /, ''))}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`p-${idx}`} className="leading-relaxed">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    })
    .filter(Boolean);

  return blocks.length > 0 ? blocks : null;
};

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({ 
  isOpen, 
  onClose, 
  onPublished,
  currentUser,
  onRequireAuth
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [body, setBody] = useState('');
  const [customReadTime, setCustomReadTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formScrollRef = useRef<HTMLFormElement>(null);

  // Reset form only when modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setActiveTab('write');
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory(CATEGORIES[0]);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setImageUrl('');
    setBody('');
    setCustomReadTime('');
    setErrorMessage(null);
    setActiveTab('write');
    setIsCropperOpen(false);
  };

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage(null);

    try {
      // Auto-scale & compress client-side via canvas
      const compressedUrl = await compressImageFile(file, 1400, 0.88);
      if (compressedUrl) {
        setImageUrl(compressedUrl);
        setIsCropperOpen(true); // Automatically open cropper modal for user alignment
      } else {
        setErrorMessage('Failed to process image file. Please try a different photo.');
      }
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage('Failed to read image file.');
    } finally {
      setIsUploadingImage(false);
    }
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

  const handleInsertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end) || 'link text';

    const url = window.prompt('Enter website link URL (e.g. https://google.com):', 'https://');
    if (!url || !url.trim() || url === 'https://') return;

    const cleanUrl = url.trim();
    const markdownLink = `[${selectedText}](${cleanUrl})`;

    const newBody = body.substring(0, start) + markdownLink + body.substring(end);
    setBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + markdownLink.length);
    }, 10);
  };

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      handleInsertLink();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertFormatting('**', '**');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertFormatting('*', '*');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your blog post.');
      setActiveTab('write');
      if (formScrollRef.current) formScrollRef.current.scrollTop = 0;
      return;
    }

    const finalCategory = (isCustomCategory ? customCategoryInput.trim() : category.trim()) || 'General';
    if (isCustomCategory && !customCategoryInput.trim()) {
      setErrorMessage('Please enter your custom category name.');
      setActiveTab('write');
      if (formScrollRef.current) formScrollRef.current.scrollTop = 0;
      return;
    }

    if (!body.trim() || body.trim().length < 15) {
      setErrorMessage('Please write the body of the blog (at least 15 characters).');
      setActiveTab('write');
      if (formScrollRef.current) formScrollRef.current.scrollTop = 0;
      return;
    }

    // Default image fallback if user didn't select one
    const finalImageUrl = imageUrl || PRESET_COVER_IMAGES[0].url;

    setIsSubmitting(true);

    try {
      const authorFullName = `${currentUser.name || 'Author'} ${currentUser.surname || ''}`.trim();
      const finalReadTime = customReadTime.trim() || calculateReadTime(body);

      const created = await saveNewBlog({
        title,
        body,
        imageUrl: finalImageUrl,
        author: authorFullName,
        authorSurname: currentUser.surname || '',
        authorAvatar: currentUser.avatarUrl || '',
        authorEmail: currentUser.email || '',
        authorBio: currentUser.bio || '',
        authorUid: currentUser.id,
        category: finalCategory,
        readTime: finalReadTime,
      });

      setIsSubmitting(false);
      resetForm();
      onPublished(created);
      onClose();
    } catch (err) {
      console.error('Failed to publish', err);
      setErrorMessage('An error occurred while saving the blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const estimatedRead = customReadTime.trim() || calculateReadTime(body);
  const activeCategory = (isCustomCategory ? customCategoryInput.trim() : category) || 'General';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
        <div 
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-200/80 flex items-center justify-center text-zinc-800">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-zinc-900">
                  Write a Blog
                </h2>
                <p className="text-xs text-zinc-500">
                  Publish a story on TanakaGaadzikwa.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Switcher */}
              <div className="flex items-center bg-zinc-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'write' 
                      ? 'bg-white text-zinc-900 shadow-sm' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'preview' 
                      ? 'bg-white text-zinc-900 shadow-sm' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Outer Form Container wrapping BOTH Write and Preview */}
          <form 
            ref={formScrollRef}
            id="write-blog-form" 
            onSubmit={handleSubmit} 
            className="flex-1 overflow-y-auto flex flex-col scroll-smooth"
          >
            {/* Modal Body */}
            <div className="flex-1 p-6 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Author Status Card */}
              {currentUser ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-300 shadow-sm"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">
                        Publishing as {currentUser.name} {currentUser.surname}
                      </div>
                      {currentUser.bio && (
                        <p className="text-[11px] text-zinc-500 line-clamp-1">
                          {currentUser.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    Verified Author
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200 gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-amber-900">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>You need an account to publish. Create your profile with photo in seconds.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onRequireAuth}
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              )}

              {activeTab === 'write' ? (
                <div className="space-y-6">
                  
                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How I Built My First Offline-First App"
                      className="w-full px-4 py-3 text-base sm:text-lg font-serif bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  {/* Category & Read Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                          Category *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCategory(!isCustomCategory);
                            if (!isCustomCategory && !customCategoryInput) {
                              setCustomCategoryInput('');
                            }
                          }}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          {isCustomCategory ? '← Pick from list' : '+ Add custom category'}
                        </button>
                      </div>

                      {isCustomCategory ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={customCategoryInput}
                            onChange={(e) => setCustomCategoryInput(e.target.value)}
                            placeholder="e.g. Artificial Intelligence, Neuroscience, Web3..."
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-emerald-500 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                            required
                            autoFocus
                          />
                          <p className="text-[10px] text-emerald-700 font-medium">
                            ✓ Registered across platform &amp; formatted with Schema.org for Google &amp; Google News indexing
                          </p>
                        </div>
                      ) : (
                        <select
                          value={category}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              setIsCustomCategory(true);
                            } else {
                              setCategory(e.target.value);
                            }
                          }}
                          className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white cursor-pointer"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="__custom__">+ Type custom category...</option>
                        </select>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Read Time</span>
                        </label>
                        <span className="text-[10px] text-zinc-400">e.g. 1 min read</span>
                      </div>
                      <input
                        type="text"
                        value={customReadTime}
                        onChange={(e) => setCustomReadTime(e.target.value)}
                        placeholder={calculateReadTime(body) || '1 min read'}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-mono"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {['1 min read', '2 min read', '3 min read', '5 min read'].map((timePreset) => (
                          <button
                            key={timePreset}
                            type="button"
                            onClick={() => setCustomReadTime(timePreset)}
                            className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              customReadTime === timePreset
                                ? 'bg-zinc-900 text-white border-zinc-900'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                            }`}
                          >
                            {timePreset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Picture Upload & Interactive Cropper */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-zinc-600" />
                        <span>Blog Cover Picture</span>
                      </label>
                      {imageUrl && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsCropperOpen(true)}
                            className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop &amp; Reposition</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="text-[11px] text-red-500 hover:underline cursor-pointer"
                          >
                            Remove picture
                          </button>
                        </div>
                      )}
                    </div>

                    {imageUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 aspect-[16/9] group bg-black">
                        <img 
                          src={imageUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-3">
                          <button
                            type="button"
                            onClick={() => setIsCropperOpen(true)}
                            className="px-4 py-2 rounded-xl bg-white text-zinc-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:bg-zinc-100 cursor-pointer"
                          >
                            <Crop className="w-4 h-4 text-sky-600" />
                            <span>Crop &amp; Reposition</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-black/70 text-white text-xs font-semibold hover:bg-black cursor-pointer border border-white/20"
                          >
                            Change Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isDragging 
                              ? 'border-zinc-900 bg-zinc-100' 
                              : 'border-zinc-300 hover:border-zinc-600 bg-zinc-50'
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
                          <Upload className="w-7 h-7 text-zinc-500 mx-auto mb-1.5" />
                          <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                            {isUploadingImage ? 'Compressing photo...' : 'Click to upload photo or drag & drop'}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Upload your photo then zoom &amp; crop to perfect 16:9 banner size
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Textarea with Markdown & Hyperlink Toolbar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        Body of the Blog *
                      </label>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                        <span>{wordCount} words</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-zinc-700">
                          <Clock className="w-3 h-3" />
                          {estimatedRead}
                        </span>
                      </div>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-zinc-100 border border-zinc-200 rounded-t-xl text-zinc-700">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="p-1.5 rounded bg-white hover:bg-zinc-200 text-zinc-900 font-bold flex items-center gap-1 text-xs border border-zinc-200 transition-colors cursor-pointer"
                        title="Bold text (**text** or Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                        <span>Bold</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Italic (*text* or Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleInsertLink}
                        className="p-1.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium flex items-center gap-1.5 text-xs border border-sky-200 transition-colors cursor-pointer"
                        title="Highlight text and click to add website link (or Ctrl+K)"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
                        <span className="font-semibold">Insert Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('### ', '')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Subheading (### Heading)"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('> ', '')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Quote (> Quote)"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('- ', '')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Bullet List (- Item)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('~', '~')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Strikethrough (~text~)"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('`', '`')}
                        className="p-1.5 rounded hover:bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Inline Code (`code`)"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onKeyDown={handleKeyDownTextarea}
                      rows={10}
                      placeholder="Write the body of your blog here... Highlight any word and click 'Insert Link' to turn it into a hyperlinked text."
                      className="w-full px-4 py-3.5 text-sm sm:text-base bg-zinc-50 border border-t-0 border-zinc-200 rounded-b-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white leading-relaxed font-sans resize-y"
                      required
                    />
                  </div>

                </div>
              ) : (
                /* Live Preview Tab */
                <div className="space-y-6">
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                    {(imageUrl || PRESET_COVER_IMAGES[0].url) && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                        <img
                          src={imageUrl || PRESET_COVER_IMAGES[0].url}
                          alt={title || 'Blog Preview'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                          {activeCategory}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          · {estimatedRead}
                        </span>
                      </div>

                      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight">
                        {title || 'Untitled Blog Post'}
                      </h1>

                      {currentUser && (
                        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                          <img 
                            src={currentUser.avatarUrl} 
                            alt={currentUser.name} 
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-sm"
                          />
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">
                              {currentUser.name} {currentUser.surname}
                            </div>
                            {currentUser.bio && (
                              <div className="text-xs text-zinc-500">
                                {currentUser.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 space-y-4 text-zinc-800 text-base leading-relaxed border-t border-zinc-100 font-sans">
                        {body ? (
                          renderFormattedBody(body)
                        ) : (
                          <p className="text-zinc-400 italic">No body text written yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/70 shrink-0">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {activeTab === 'write' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                >
                  Preview
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                >
                  Back to Edit
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || isUploadingImage}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Photo Cropper Modal */}
      {imageUrl && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageUrl={imageUrl}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={(croppedUrl) => {
            setImageUrl(croppedUrl);
          }}
        />
      )}
    </>
  );
};
