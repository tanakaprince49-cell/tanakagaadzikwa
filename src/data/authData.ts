import { UserProfile } from '../types';

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
  }).catch((e) => console.warn('Auth server sync warning:', e));

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
    return { error: 'No account found with this email. Please create an account.' };
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

export function signOut(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent('tg_auth_changed', { detail: null }));
}
