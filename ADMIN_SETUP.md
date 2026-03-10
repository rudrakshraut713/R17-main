# R17 Gaming Admin Panel Setup Guide

## Overview
This guide explains how to set up and use the admin panel for the R17 Gaming platform.

## Initial Setup

### 1. Configure Firebase
Before using the admin panel, you need to configure Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication and Firestore Database
4. Update the Firebase configuration in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2. Create Your First Admin User

#### Option A: Using the Admin Setup Page
1. Navigate to your website with the setup parameter: `http://localhost:3000/?setup=admin`
2. Fill in the admin user details:
   - Display Name: Your admin name
   - Email: Your admin email
   - Password: Secure password (min 6 characters)
   - Role: Admin
3. Click "Create Admin User"
4. You'll see a success message when the admin user is created

#### Option B: Using the Default Admin
The system includes a default admin user:
- Email: `admin@r17gaming.com`
- Password: `admin123456`

**⚠️ Important: Change the default password immediately after first login!**

## Using the Admin Panel

### 1. Accessing the Admin Panel
1. Login to your website using the admin credentials
2. Scroll to the bottom of the page
3. Click the "Admin Panel" button in the footer
4. You'll be redirected to the admin dashboard

### 2. Admin Panel Features
The admin panel includes the following management sections:

- **Tournaments**: Manage gaming tournaments
- **Blog Posts**: Create and edit blog content
- **About**: Update about page content
- **Contact Messages**: View and respond to contact form submissions
- **Users**: Manage user accounts and roles
- **Chat Topics**: Manage community chat topics
- **Live Streams**: Manage live streaming content

### 3. User Roles
The system supports three user roles:

- **Admin**: Full access to all features
- **Editor**: Can manage content (blogs, tournaments, etc.)
- **Moderator**: Can manage community features (chat, users)

## Authentication Features

### Login/Register
- Users can register new accounts from the navbar
- Login functionality is available in the navbar
- Authentication state is managed globally
- Users see their email when logged in

### Security
- All admin routes are protected
- Only authenticated users can access admin features
- Firebase handles secure authentication

## Troubleshooting

### Common Issues

1. **"Login button does nothing"**
   - ✅ Fixed: Login button now opens authentication modal

2. **"Cannot access admin panel"**
   - Make sure you're logged in
   - Check that you have admin privileges
   - Verify Firebase configuration

3. **"Registration not working"**
   - ✅ Fixed: Registration is now fully implemented
   - Check Firebase Authentication settings
   - Ensure email/password authentication is enabled

4. **"Admin panel shows broken content"**
   - ✅ Fixed: Removed broken table code
   - Admin panel now properly renders management components

### Firebase Setup Issues
- Ensure Authentication is enabled in Firebase Console
- Check that Email/Password sign-in method is enabled
- Verify Firestore Database is created and rules allow read/write

## Development Notes

### File Structure
```
src/
├── components/
│   ├── AuthModal.tsx          # Login/Register modal
│   ├── AdminSetup.tsx         # Initial admin user creation
│   ├── admin/
│   │   └── AdminPanel.tsx     # Main admin dashboard
│   └── layout/
│       └── Navigation.tsx     # Navbar with auth buttons
├── hooks/
│   └── useAuth.ts            # Authentication hook
├── utils/
│   └── adminUtils.ts         # Admin user creation utilities
└── firebase/
    └── config.ts             # Firebase configuration
```

### Key Components
- **AuthModal**: Handles login and registration
- **AdminPanel**: Main admin dashboard with tabbed interface
- **AdminSetup**: One-time admin user creation
- **useAuth**: Global authentication state management

## Next Steps
1. Set up Firebase project
2. Create your first admin user
3. Login and access the admin panel
4. Customize the management components as needed
5. Add more admin users as required

For additional help, check the Firebase documentation or contact the development team.
