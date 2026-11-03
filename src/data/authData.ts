import { UserProfile } from '../types';
import { auth, db, googleProvider, logOut } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const REGISTERED_USERS_KEY = 'tg_registered_users_v2';
const CURRENT_USER_KEY = 'tg_current_user_v2';

interface StoredAccount extends UserProfile {
  passwordHash: string;
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse current user session', err);
    return null;
  }
}

export function getRegisteredUsers(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Convert a Firebase User into our UserProfile format
export async function syncFirebaseUserToProfile(fbUser: User, customBio?: string): Promise<UserProfile> {
  const displayName = fbUser.displayName || 'Google User';
  const parts = displayName.trim().split(/\s+/);
  let name = parts[0] || 'User';
  let surname = parts.slice(1).join(' ') || '';
  const email = fbUser.email || '';
  let avatarUrl = fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
  let bio = customBio || '';
  let password = '';

  // Attempt to fetch existing profile from Firestore to preserve custom author attributes
  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.name) name = data.name;
      if (data.surname !== undefined) surname = data.surname;
      if (data.avatarUrl) avatarUrl = data.avatarUrl;
      if (data.bio) bio = data.bio;
      if (data.password) password = data.password;
    } else {
      // Save initial profile to Firestore
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        name,
        surname,
        email,
        avatarUrl,
        bio: bio || '',
        password: '',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Firestore profile sync warning:', err);
  }

  const profile: UserProfile = {
    id: fbUser.uid,
    name,
    surname,
    email,
    avatarUrl,
    bio,
    password: password || undefined,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: profile }));
  return profile;
}

// Sign in with Google using Firebase Auth
export async function signInWithGoogleAuth(): Promise<{ user?: UserProfile; error?: string; cancelled?: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await syncFirebaseUserToProfile(result.user);
    return { user: profile };
  } catch (err: any) {
    const code = err?.code || '';
    const message = err?.message || '';

    // Handle user closing popup without completing
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      message.includes('popup-closed-by-user')
    ) {
      return { cancelled: true };
    }

    // Handle browser blocking popup window
    if (code === 'auth/popup-blocked') {
      return { error: 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.' };
    }

    // Handle domain not authorized in Firebase Console
    if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      return {
        error: `Domain "${currentHost}" is not authorized in your Firebase project (${auth.app.options.projectId}). Please add "${currentHost}" and "tanakagaadzikwa.com" in Firebase Console > Authentication > Settings > Authorized domains.`,
      };
    }

    // Handle Google provider not enabled in Firebase Console
    if (code === 'auth/operation-not-allowed') {
      return {
        error: 'Google sign-in is not enabled in Firebase Console yet. Please enable "Google" under Firebase Console > Authentication > Sign-in method.',
      };
    }

    console.warn('Google Sign-In response status:', code || message);
    const msg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
    return { error: msg };
  }
}

// Update author profile bio and persist to Firestore
export async function updateUserBio(bio: string): Promise<UserProfile | null> {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = { ...current, bio: bio.trim() };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

  if (auth.currentUser) {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { bio: bio.trim() }, { merge: true });
    } catch (e) {
      console.warn('Failed to update bio in Firestore:', e);
    }
  }

  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: updated }));
  return updated;
}

// Update complete author profile (name, surname, bio, password, avatarUrl)
export async function updateFullUserProfile(data: {
  name: string;
  surname: string;
  bio: string;
  avatarUrl: string;
  password?: string;
}): Promise<UserProfile | null> {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    name: data.name.trim() || current.name,
    surname: data.surname.trim(),
    bio: data.bio.trim(),
    avatarUrl: data.avatarUrl.trim() || current.avatarUrl,
    password: data.password !== undefined ? data.password.trim() : current.password,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

  if (auth.currentUser) {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(
        userDocRef,
        {
          uid: auth.currentUser.uid,
          name: updated.name,
          surname: updated.surname,
          bio: updated.bio || '',
          avatarUrl: updated.avatarUrl,
          password: updated.password || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Failed to update full profile in Firestore:', e);
    }
  }

  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: updated }));
  return updated;
}

// Listen to Firebase Auth state changes
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        await syncFirebaseUserToProfile(fbUser);
      } catch (e) {
        console.warn('Auth state sync error:', e);
      }
    }
  });
}

export function signUp(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
  avatarUrl: string;
  bio?: string;
}): { user?: UserProfile; error?: string } {
  const name = data.name.trim();
  const surname = data.surname.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password.trim();
  const avatarUrl = data.avatarUrl?.trim() || '';
  const bio = data.bio?.trim() || '';

  if (!name) return { error: 'Please enter your first name.' };
  if (!surname) return { error: 'Please enter your surname.' };
  if (!email || !email.includes('@')) return { error: 'Please enter a valid email address.' };
  if (!password || password.length < 4) return { error: 'Password must be at least 4 characters long.' };
  if (!avatarUrl) return { error: 'Please upload your preferred profile picture.' };

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return { error: 'An account with this email already exists. Please sign in.' };
  }

  const userProfile: UserProfile = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    surname,
    email,
    avatarUrl,
    bio,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const storedAccount: StoredAccount = {
    ...userProfile,
    passwordHash: password,
  };

  const updatedUsers = [...users, storedAccount];
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));

  // Sync with backend API
  fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, surname, email, password, avatarUrl, bio }),
  }).catch(() => {});

  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: userProfile }));
  return { user: userProfile };
}

export function signIn(emailInput: string, passwordInput: string): { user?: UserProfile; error?: string } {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' };
  }

  const users = getRegisteredUsers();
  const matched = users.find((u) => u.email === email);

  if (!matched) {
    return { error: 'No account found with this email. Please sign in with Google or create an account.' };
  }

  if (matched.passwordHash !== password) {
    return { error: 'Incorrect password. Please try again.' };
  }

  const userProfile: UserProfile = {
    id: matched.id,
    name: matched.name,
    surname: matched.surname,
    email: matched.email,
    avatarUrl: matched.avatarUrl,
    bio: matched.bio,
    createdAt: matched.createdAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));

  // Sync sign in with server
  fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).catch(() => {});

  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: userProfile }));
  return { user: userProfile };
}

export async function signOut(): Promise<void> {
  try {
    await logOut();
  } catch (e) {
    console.warn('Firebase signout warning:', e);
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: null }));
}
