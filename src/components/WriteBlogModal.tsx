import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  ImageIcon, 
  Eye, 
  Edit3, 
  Check, 
  AlertCircle,
  Clock,
  Bold,
  Italic,
  Heading2,
  Quote,
  List,
  Lock
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { saveNewBlog, calculateReadTime } from '../data/blogsData';

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
  const [imageUrl, setImageUrl] = useState('');
  const [body, setBody] = useState('');
  
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

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your blog post.');
      return;
    }

    if (!imageUrl) {
      setErrorMessage('Please upload a cover picture for your blog.');
      return;
    }

    if (!body.trim() || body.trim().length < 20) {
      setErrorMessage('Please write the body of the blog (at least 20 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const authorFullName = `${currentUser.name} ${currentUser.surname}`.trim();

      const created = saveNewBlog({
        title,
        body,
        imageUrl,
        author: authorFullName,
        category,
      });

      // Attach author avatar and email
      created.authorAvatar = currentUser.avatarUrl;
      created.authorEmail = currentUser.email;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm flex items-center gap-2.5">
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
                  <div className="text-[11px] text-zinc-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
                className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                Sign In / Sign Up
              </button>
            </div>
          )}

          {activeTab === 'write' ? (
            <form id="write-blog-form" onSubmit={handleSubmit} className="space-y-6">
              
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

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Picture Upload (Presets and URL completely removed) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-zinc-600" />
                    <span>Picture *</span>
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove picture
                    </button>
                  )}
                </div>

                {imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 aspect-[21/9]">
                    <img 
                      src={imageUrl} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[11px] font-medium text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                        Selected Picture
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
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
                    <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                      Click to choose a picture or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Body Textarea with Markdown Toolbar */}
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
                <div className="flex items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 rounded-t-xl text-zinc-600">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded hover:bg-white hover:text-zinc-900 transition-colors"
                    title="Bold (**text**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded hover:bg-white hover:text-zinc-900 transition-colors"
                    title="Italic (*text*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ', '')}
                    className="p-1.5 rounded hover:bg-white hover:text-zinc-900 transition-colors"
                    title="Subheading (### Heading)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ', '')}
                    className="p-1.5 rounded hover:bg-white hover:text-zinc-900 transition-colors"
                    title="Quote (> Quote)"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ', '')}
                    className="p-1.5 rounded hover:bg-white hover:text-zinc-900 transition-colors"
                    title="Bullet List (- Item)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  placeholder="Write the body of your blog here..."
                  className="w-full px-4 py-3.5 text-sm sm:text-base bg-zinc-50 border border-t-0 border-zinc-200 rounded-b-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white leading-relaxed font-sans resize-y"
                  required
                />
              </div>

            </form>
          ) : (
            /* Live Preview Tab */
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                {imageUrl && (
                  <div className="relative aspect-[21/9] w-full overflow-hidden bg-zinc-100">
                    <img
                      src={imageUrl}
                      alt={title || 'Blog Preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                      {category}
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
                        <div className="text-xs text-zinc-500">
                          Author Profile
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-4 text-zinc-700 text-sm sm:text-base leading-relaxed border-t border-zinc-100">
                    {body ? (
                      body.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic">No body text yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'write' ? (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Preview
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Back to Edit
              </button>
            )}

            <button
              type="submit"
              form="write-blog-form"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
