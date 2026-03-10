import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface AdminUser {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'editor' | 'moderator';
}

export const createAdminUser = async (userData: AdminUser) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.displayName
    });

    // Create user document in Firestore with role
    await setDoc(doc(db, 'users', user.uid), {
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      createdAt: new Date(),
      isActive: true
    });

    console.log('Admin user created successfully:', user.uid);
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const createDefaultAdmin = async () => {
  const defaultAdmin: AdminUser = {
    email: 'admin@r17gaming.com',
    password: 'admin123456',
    displayName: 'R17 Gaming Admin',
    role: 'admin'
  };

  return await createAdminUser(defaultAdmin);
};
