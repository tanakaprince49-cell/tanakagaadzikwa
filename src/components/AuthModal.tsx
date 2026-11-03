import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  AlertCircle, 
  Camera, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  User, 
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithGoogleAuth, updateFullUserProfile } from '../data/authData';
import { compressImageFile } from '../utils/imageCompressor';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup' | 'profile';
  existingUser?: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'signin',
  existingUser = null
}) => {
  // Step state: 'google_signin' or 'customize_profile'
  const [step, setStep] = useState<'google_signin' | 'customize_profile'>('google_signin');
  
  // Profile customization fields
  const [activeUser, setActiveUser] = useState<UserProfile | null>(existingUser);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or existingUser changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (initialMode === 'profile' && existingUser) {
        setStep('customize_profile');
        populateFields(existingUser);
      } else {
        setStep('google_signin');
      }
    }
  }, [isOpen, initialMode, existingUser]);

  const populateFields = (user: UserProfile) => {
    setActiveUser(user);
    setName(user.name || '');
    setSurname(user.surname || '');
    setBio(user.bio || '');
    setAvatarUrl(user.avatarUrl || '');
    setPassword(user.password || '');
  };

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogleAuth();
      if (res.cancelled) {
        // User closed popup; reset quietly
        setErrorMessage(null);
      } else if (res.error) {
        setErrorMessage(res.error);
      } else if (res.user) {
        // Advance to Step 2: Customize Author Profile
        populateFields(res.user);
        setStep('customize_profile');
      }
    } catch (err) {
      console.warn('Google Sign In caught exception:', err);
      setErrorMessage('Could not complete Google Sign-In. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      const compressedAvatar = await compressImageFile(file, 400, 0.82);
      if (compressedAvatar) {
        setAvatarUrl(compressedAvatar);
        setErrorMessage(null);
      } else {
        setErrorMessage('Failed to process image file.');
      }
    } catch (err) {
      console.error('Avatar processing error:', err);
      setErrorMessage('Failed to process photo.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your first name.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await updateFullUserProfile({
        name: name.trim(),
        surname: surname.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl || (activeUser?.avatarUrl || ''),
        password: password.trim() || undefined,
      });

      if (updated) {
        onSuccess(updated);
        onClose();
      } else if (activeUser) {
        onSuccess(activeUser);
        onClose();
      }
    } catch (err) {
      console.error('Failed to save profile updates:', err);
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSkipOrKeepDefaults = () => {
    if (activeUser) {
      onSuccess(activeUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="font-serif text-xl font-semibold text-zinc-900">
              {step === 'google_signin' ? 'Sign In with Google' : 'Customize Author Profile'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {step === 'google_signin'
                ? 'Quick, secure sign in to publish blogs on TanakaGaadzikwa.com'
                : 'Add your preferred name, surname, bio, photo & password'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'google_signin' ? (
            /* STEP 1: PURE SIGN IN WITH GOOGLE ONLY */
            <div className="space-y-6">
              
              {/* Creator highlight box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Author Privileges</span>
                </div>
                <ul className="text-xs text-zinc-600 space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Publish blogs with custom read times and categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Get your own author bio &amp; profile indexed on Google &amp; Google News</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Customize your name, bio, profile photo, and password</span>
                  </li>
                </ul>
              </div>

              {/* Single Primary Action: Sign in with Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-sm shadow-sm transition-all cursor-pointer hover:border-zinc-400 active:scale-[0.99] disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="pt-2 text-center text-[11px] text-zinc-400 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="/terms" target="_blank" className="underline hover:text-zinc-700">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" className="underline hover:text-zinc-700">Privacy Policy</a>.
              </div>
            </div>
          ) : (
            /* STEP 2: CUSTOMIZE AUTHOR PROFILE (Name, Surname, BIO, Password, Profile Pic) */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center justify-center space-y-2 py-1">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 hover:border-zinc-500 cursor-pointer overflow-hidden flex items-center justify-center transition-all group shadow-sm"
                  title="Click to choose a profile picture"
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-zinc-400 group-hover:text-zinc-600" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-medium">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span>Change</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleAvatarUpload(e.target.files[0]);
                    }
                  }}
                />

                <span className="text-[11px] font-medium text-zinc-500">
                  {avatarUrl ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Profile Photo Set (Click to replace)
                    </span>
                  ) : (
                    'Upload your preferred profile picture'
                  )}
                </span>
              </div>

              {/* Name & Surname Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-400" />
                    <span>First Name *</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanaka"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    Surname
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Gaadzikwa"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Author Bio */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-zinc-400" />
                  <span>Author Bio / About You</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Tech founder & software builder based in Harare. Writing about startups, AI, and building from Zimbabwe."
                  rows={3}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-sans resize-none leading-relaxed"
                />
                <span className="text-[10px] text-zinc-400">
                  This bio is shown on all your published blogs and indexed in your Google &amp; Google News author profile.
                </span>
              </div>

              {/* Password / Security PIN */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Password / PIN (optional)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set an optional password or security PIN"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkipOrKeepDefaults}
                  className="flex-1 py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Keep Google Defaults
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time Sync with Firebase Firestore &amp; Google Auth</span>
        </div>
      </div>
    </div>
  );
};
