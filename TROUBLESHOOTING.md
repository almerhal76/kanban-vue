# 🚨 Troubleshooting Guide

Panduan mengatasi masalah umum pada aplikasi Kanban Management System.

## ❌ Error: auth/configuration-not-found

### Penyebab:
- Konfigurasi Firebase tidak terbaca dengan benar
- Environment variables tidak ter-load
- Development server belum di-restart setelah mengubah .env

### Solusi:

#### 1. Periksa File .env
Pastikan file `.env` ada di root project dan berisi:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBGHDpPoYTEkd8V49AyElVIdB14mWFHxhU
VITE_FIREBASE_AUTH_DOMAIN=kanban-vue-dd91a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kanban-vue-dd91a
VITE_FIREBASE_STORAGE_BUCKET=kanban-vue-dd91a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148717268627
VITE_FIREBASE_APP_ID=1:148717268627:web:f0ae4680794f1c6313e766
```

#### 2. Restart Development Server
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

#### 3. Periksa Console Browser
1. Buka Developer Tools (F12)
2. Lihat tab Console
3. Cari pesan "🔥 Firebase Config Debug"
4. Pastikan semua konfigurasi menunjukkan "✅ Set"

#### 4. Test Firebase Connection
1. Buka aplikasi di browser
2. Klik tombol "🔍 Debug" untuk melihat status Firebase
3. Klik tombol "🔥 Test Firebase" untuk test koneksi

## ❌ Error: Firebase/app-not-initialized

### Penyebab:
- Firebase app belum ter-initialize dengan benar
- Konfigurasi Firebase salah

### Solusi:

#### 1. Periksa Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pastikan project "kanban-vue-dd91a" ada
3. Periksa konfigurasi web app

#### 2. Regenerate Firebase Config
1. Di Firebase Console, pilih project Anda
2. Klik ⚙️ Settings → Project settings
3. Scroll ke "Your apps" → pilih web app
4. Copy konfigurasi baru ke .env

## ❌ Error: Permission Denied (Firestore)

### Penyebab:
- Firestore security rules terlalu ketat
- User belum login
- Database belum dibuat

### Solusi:

#### 1. Periksa Firestore Database
1. Di Firebase Console → Firestore Database
2. Pastikan database sudah dibuat
3. Periksa security rules

#### 2. Set Test Mode Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

#### 3. Pastikan User Login
- Register user baru di `/register`
- Login dengan credentials yang benar

## ❌ Error: Network Request Failed

### Penyebab:
- Koneksi internet bermasalah
- Firebase services down
- Firewall/proxy blocking

### Solusi:

#### 1. Periksa Koneksi Internet
```bash
# Test koneksi ke Firebase
ping firebase.google.com
```

#### 2. Periksa Firebase Status
- Kunjungi [Firebase Status Page](https://status.firebase.google.com)

#### 3. Bypass Proxy/Firewall
- Coba dengan koneksi internet lain
- Disable VPN sementara

## ❌ Error: Module Not Found

### Penyebab:
- Dependencies belum ter-install
- Node modules corrupt

### Solusi:

#### 1. Reinstall Dependencies
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

#### 2. Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear Vite cache
rm -rf .vite
```

## 🔍 Debug Tools

### 1. Firebase Debug Component
- Klik tombol "🔍 Debug" di dashboard
- Lihat status semua konfigurasi Firebase

### 2. Browser Console
- Buka Developer Tools (F12)
- Tab Console untuk error messages
- Tab Network untuk failed requests

### 3. Firebase Test Button
- Klik "🔥 Test Firebase" di dashboard
- Periksa hasil test di console

## 📋 Checklist Troubleshooting

### ✅ Environment Setup
- [ ] File `.env` ada di root project
- [ ] Semua VITE_FIREBASE_* variables terisi
- [ ] Development server sudah di-restart

### ✅ Firebase Console
- [ ] Project Firebase sudah dibuat
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database sudah dibuat
- [ ] Web app sudah terdaftar

### ✅ Application
- [ ] Dependencies ter-install (`npm install`)
- [ ] No build errors
- [ ] Firebase debug menunjukkan "✅ Configured"
- [ ] Test Firebase menunjukkan success

## 🆘 Masih Bermasalah?

### 1. Reset Complete Setup
```bash
# 1. Hapus .env
rm .env

# 2. Copy dari example
cp .env.example .env

# 3. Edit .env dengan konfigurasi Firebase yang benar

# 4. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 5. Restart server
npm run dev
```

### 2. Create New Firebase Project
1. Buat project Firebase baru
2. Enable Authentication & Firestore
3. Generate konfigurasi web app baru
4. Update .env dengan konfigurasi baru

### 3. Check Firebase Quotas
- Periksa usage di Firebase Console
- Pastikan tidak exceed free tier limits

## 📞 Support

Jika masih mengalami masalah:
1. Periksa [Firebase Documentation](https://firebase.google.com/docs)
2. Cek [Firebase Support](https://firebase.google.com/support)
3. Lihat error message lengkap di browser console