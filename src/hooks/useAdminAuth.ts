import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export function useAdminAuth() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // 检查用户是否有管理员角色
          setIsAdmin(userData.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin privileges');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isLoading, error };
}