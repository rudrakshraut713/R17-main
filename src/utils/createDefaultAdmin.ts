import { createDefaultAdmin } from './adminUtils';

// Function to create the default admin user
export const setupDefaultAdmin = async () => {
  console.log('Creating default admin user...');
  
  const result = await createDefaultAdmin();
  
  if (result.success) {
    console.log('✅ Default admin user created successfully!');
    console.log('Email: admin@r17gaming.com');
    console.log('Password: admin123456');
    return true;
  } else {
    console.error('❌ Failed to create default admin user:', result.error);
    return false;
  }
};

// You can call this function from the browser console or add it to a button
// Example usage in browser console:
// import { setupDefaultAdmin } from './utils/createDefaultAdmin';
// setupDefaultAdmin();
