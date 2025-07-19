# 🔥 Firebase Firestore Setup Guide

Panduan lengkap setup Firebase Firestore untuk aplikasi Kanban Management System.

## 📋 Prerequisites

- Akun Google/Gmail
- Project sudah di-clone dan dependencies ter-install

## 🚀 Step-by-Step Setup

### 1. Buat Firebase Project

1. **Buka Firebase Console**
   - Kunjungi [console.firebase.google.com](https://console.firebase.google.com)
   - Login dengan akun Google

2. **Create New Project**
   - Klik "Add project" atau "Create a project"
   - Masukkan nama project: `kanban-management-system`
   - Pilih apakah ingin Google Analytics (opsional)
   - Klik "Create project"

### 2. Setup Web App

1. **Register Web App**
   - Di project dashboard, klik ikon web `</>`
   - App nickname: `Kanban Web App`
   - Centang "Also set up Firebase Hosting" (opsional)
   - Klik "Register app"

2. **Copy Configuration**
   - Copy konfigurasi yang muncul
   - Simpan untuk langkah selanjutnya

### 3. Enable Authentication

1. **Buka Authentication**
   - Di sidebar, pilih "Authentication"
   - Klik "Get started" jika pertama kali

2. **Enable Email/Password**
   - Klik tab "Sign-in method"
   - Pilih "Email/Password"
   - Enable "Email/Password"
   - Klik "Save"

### 4. Setup Cloud Firestore

1. **Create Firestore Database**
   - Di sidebar, pilih "Firestore Database"
   - Klik "Create database"

2. **Choose Security Rules**
   - **Development**: Pilih "Start in test mode"
   - **Production**: Pilih "Start in production mode"

3. **Select Location**
   - Pilih lokasi server terdekat dengan user Anda
   - Contoh: `asia-southeast1` untuk Asia Tenggara
   - Klik "Done"

### 5. Configure Environment Variables

1. **Copy .env.example**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   ```bash
   # Set database provider to firebase
   VITE_DB_PROVIDER=firebase
   
   # Add your Firebase config
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### 6. Test Connection

1. **Run Application**
   ```bash
   npm run dev
   ```

2. **Test Firebase Connection**
   - Buka aplikasi di browser
   - Klik tombol "🔥 Test Firebase"
   - Periksa console browser untuk hasil test

### 7. Deploy Security Rules (Production)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firestore**
   ```bash
   firebase init firestore
   ```
   - Pilih existing project
   - Use default firestore.rules file
   - Use default firestore.indexes.json file

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🔒 Security Rules Explanation

### Test Mode Rules (Development)
```javascript
// Allows read/write access to all users (TIDAK AMAN untuk production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

### Production Rules (Recommended)
```javascript
// Role-based access control
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && getUserRole() == 'admin';
      allow update: if request.auth != null && getUserRole() in ['admin', 'editor'];
      allow delete: if request.auth != null && getUserRole() == 'admin';
    }
  }
}
```

## 🧪 Testing

### Manual Testing
1. Register user baru
2. Login dengan user tersebut
3. Buat project baru (jika admin)
4. Tambah task ke project
5. Pindahkan task antar kolom

### Automated Testing
```bash
# Test database connection
npm run dev
# Klik "🔥 Test Firebase" di dashboard
```

## 🚨 Troubleshooting

### Common Issues

**Error: "Firebase config not found"**
- Pastikan file `.env` sudah dibuat dan diisi
- Restart development server: `npm run dev`

**Error: "Permission denied"**
- Periksa Firestore security rules
- Pastikan user sudah login
- Periksa role user di collection `users`

**Error: "Auth domain not authorized"**
- Periksa `authDomain` di konfigurasi
- Pastikan domain sudah terdaftar di Firebase Console

**Error: "Project not found"**
- Periksa `projectId` di konfigurasi
- Pastikan project ID sesuai dengan Firebase Console

### Debug Steps

1. **Check Console Logs**
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error messages

2. **Verify Configuration**
   - Pastikan semua environment variables terisi
   - Periksa Firebase Console untuk project settings

3. **Test Connection**
   - Gunakan tombol "🔥 Test Firebase" di aplikasi
   - Periksa network tab untuk failed requests

## 📊 Monitoring

### Firebase Console
- **Authentication**: Monitor user registrations dan logins
- **Firestore**: Lihat data collections dan documents
- **Usage**: Monitor read/write operations

### Application Logs
- Browser console untuk client-side errors
- Network tab untuk API call failures

## 🎯 Best Practices

1. **Security**
   - Gunakan production security rules
   - Jangan expose API keys di client-side
   - Implement proper role-based access

2. **Performance**
   - Use compound queries dengan indexes
   - Limit query results dengan pagination
   - Cache frequently accessed data

3. **Cost Optimization**
   - Monitor read/write operations
   - Use offline persistence
   - Implement efficient query patterns

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Pricing](https://firebase.google.com/pricing)