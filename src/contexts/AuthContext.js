// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase'; // import googleProvider here
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check onboarding status in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        const data = snap.exists() ? snap.data() : null;
        setNeedsOnboarding(!snap.exists() || !data?.class);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setNeedsOnboarding(false);
      }
    });
    return unsubscribe;
  }, []);

  // Sign in with Google -- use the pre-configured provider!
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Sign out
  const logout = () => signOut(auth);

  const value = {
    user,
    needsOnboarding,
    setNeedsOnboarding,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
