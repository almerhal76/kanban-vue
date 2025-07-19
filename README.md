# Kanban Management System

Sistem manajemen kanban untuk perusahaan dengan 3 level role user yang berbeda.

## Fitur Utama

### Role Management
- **Admin**: Dapat membuat proyek baru dan mengelola semua aspek
- **Editor**: Dapat menambahkan progress dan mengedit task
- **Viewer**: Hanya dapat melihat proyek dan task

### Fitur Kanban
- Drag & drop task antar kolom (Todo, In Progress, Done)
- Assign task ke klien/penanggung jawab
- Priority level untuk setiap task
- Real-time updates menggunakan Firebase Firestore

### Teknologi
- **Frontend**: Vue.js 3 + Composition API
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore + Authentication
- **Build Tool**: Vite

## Database

### 🔥 Firebase Firestore
- **Real-time**: Sinkronisasi real-time antar user
- **Scalable**: Mendukung banyak user concurrent  
- **Secure**: Firestore security rules dengan role-based access
- **NoSQL**: Document-based database yang fleksibel
- **Offline**: Support offline dengan auto-sync

## Setup Proyek

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Firebase

#### A. Setup Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik "Add project" → Masukkan nama project
3. Klik ikon web `</>` → Daftarkan app
4. Copy konfigurasi yang muncul

#### B. Aktifkan Services

**Authentication:**
- Pilih "Authentication" → "Sign-in method"
- Enable "Email/Password"

**Cloud Firestore (bukan Realtime Database):**
- Pilih "Firestore Database" → "Create database"
- Pilih "Start in test mode" untuk development
- Pilih lokasi server (pilih yang terdekat dengan user Anda)
- **PENTING**: Pastikan pilih "Firestore" bukan "Realtime Database"

#### C. Setup Environment Variables
1. Copy `.env.example` ke `.env`
2. Isi dengan konfigurasi Firebase Anda:
```bash
cp .env.example .env
```

#### D. Setup Firestore Database
1. **Buat Database**:
   - Di Firebase Console, pilih "Firestore Database"
   - Klik "Create database"
   - Pilih "Start in test mode" (untuk development)
   - Pilih lokasi server terdekat

2. **Deploy Security Rules** (Opsional untuk production):
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Initialize Firestore
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

3. **Verifikasi Setup**:
   - Pastikan Collections "users" dan "projects" bisa dibuat
   - Test dengan tombol "🔥 Test Firebase" di aplikasi

### 3. Jalankan Development Server
```bash
npm run dev
```

### 4. Build untuk Production
```bash
npm run build
```

## Struktur Database

### 🔥 **Cloud Firestore**

#### Collection: `users`
```javascript
// Document ID: user-uid
{
  uid: "user-id",
  email: "user@example.com", 
  name: "Nama User",
  role: "admin|editor|viewer",
  createdAt: Timestamp
}
```

#### Collection: `projects`
```javascript
// Document ID: auto-generated
{
  id: "project-id",
  title: "Nama Proyek",
  description: "Deskripsi proyek", 
  clients: ["Klien A", "Klien B"],
  createdBy: "user-id",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tasks: {
    todo: [
      {
        id: "task-id",
        title: "Judul Task",
        description: "Deskripsi task",
        priority: "high|medium|low", 
        assignedTo: "Nama Klien",
        createdAt: Timestamp,
        updatedAt: Timestamp
      }
    ],
    inProgress: [...],
    done: [...]
  }
}
```

#### Firestore Features:
- **Real-time listeners**: Otomatis update UI saat data berubah
- **Offline support**: Bekerja offline, sync saat online
- **Security rules**: Role-based access control
- **Scalable**: Auto-scaling berdasarkan usage

## Panduan Penggunaan

### 1. Registrasi User Baru
- Akses halaman `/register`
- Pilih role yang sesuai
- Lengkapi data registrasi

### 2. Login
- Akses halaman `/login`
- Masukkan email dan password yang sudah dibuat

### 3. Dashboard
- Lihat semua proyek yang tersedia
- Admin dapat membuat proyek baru
- Klik proyek untuk melihat detail

### 4. Detail Proyek
- Lihat kanban board dengan 3 kolom
- Admin/Editor dapat menambah task baru
- Admin/Editor dapat edit task existing
- Viewer hanya dapat melihat

## Optimasi Performance

### 1. Lazy Loading
- Komponen dimuat secara lazy untuk mengurangi bundle size
- Route-based code splitting

### 2. Firebase Optimizations
- Efficient queries dengan indexing
- Real-time listeners hanya pada data yang diperlukan
- Proper error handling dan loading states

### 3. Vue.js Best Practices
- Composition API untuk better tree-shaking
- Computed properties untuk reactive data
- Proper component lifecycle management

## Security

### 1. Firestore Security Rules
```javascript
// firestore.rules - Cloud Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to get user role from Firestore
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Projects collection with role-based access
    match /projects/{projectId} {
      // Anyone authenticated can read projects
      allow read: if request.auth != null;
      
      // Only admins can create projects  
      allow create: if request.auth != null && getUserRole() == 'admin';
      
      // Admins and editors can update projects
      allow update: if request.auth != null && getUserRole() in ['admin', 'editor'];
      
      // Only admins can delete projects
      allow delete: if request.auth != null && getUserRole() == 'admin';
    }
  }
}
```

### 2. Frontend Security
- Route guards berdasarkan authentication status
- Role-based UI rendering
- Input validation dan sanitization

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist folder ke Vercel
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Troubleshooting

### Common Issues
1. **Firebase connection error**: Periksa konfigurasi di `.env`
2. **Build error**: Pastikan semua dependencies terinstall dengan benar
3. **Authentication error**: Periksa Firebase Authentication settings
4. **Permission denied**: Periksa Firestore security rules

### Performance Issues
1. **Slow loading**: Implementasikan lazy loading untuk komponen besar
2. **Memory leaks**: Pastikan cleanup listeners Firebase dengan benar
3. **Bundle size**: Analyze dengan `npm run build -- --analyze`

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)