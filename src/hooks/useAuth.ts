import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register, logout };
}