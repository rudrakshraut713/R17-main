import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Generic type for Firestore documents
export interface FirestoreDoc {
  id?: string;
  [key: string]: any;
}

export function useFirestore<T extends FirestoreDoc>(collectionName: string) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch documents when hook is instantiated
  useEffect(() => {
    const unsubscribe = getDocuments();
    return () => unsubscribe();
  }, [collectionName]);

  // Add a document
  const addDocument = async (data: Omit<T, 'id'>) => {
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...data };
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };

  // Update a document
  const updateDocument = async (id: string, data: Partial<T>) => {
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  // Get documents with optional query constraints
  const getDocuments = (queryConstraints: QueryConstraint[] = []) => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, collectionName), ...queryConstraints);
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const results: T[] = [];
        if (snapshot.empty) {
          console.log(`No documents found in ${collectionName} collection`);
        }
        snapshot.forEach(doc => {
          const data = doc.data();
          // 确保数据格式化正确
          if (collectionName === 'users' && !data.username && data.displayName) {
            data.username = data.displayName;
          }
          if (collectionName === 'users' && !data.registeredDate && data.createdAt) {
            data.registeredDate = new Date(data.createdAt.toDate()).toISOString().split('T')[0];
          }
          results.push({ id: doc.id, ...data } as T);
        });
        console.log(`Retrieved ${results.length} documents from ${collectionName}`);
        setDocuments(results);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Return unsubscribe function
    return unsubscribe;
  };

  return { 
    documents, 
    loading, 
    error, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    getDocuments 
  };
}