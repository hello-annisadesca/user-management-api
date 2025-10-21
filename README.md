# 🧑‍💻 User Management API 
Proyek **User Management API** ini adalah RESTful API berbasis Node.js, Express.js, dan PostgreSQL untuk mengelola data pengguna.  

API ini mencakup fitur autentikasi, registrasi, update profil, serta dokumentasi melalui Postman.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM/Query:** pg (native PostgreSQL driver)
- **Documentation:** Postman API Collection


## 📂 Project Structure
```bash
user_management_api/
├── src/
│ ├── controllers/ # Logika bisnis (register, login, update, dll)
│ ├── models/ # Query ke database PostgreSQL
│ ├── routes/ # Endpoint routing Express.js
│ ├── middleware/ # JWT Auth middleware
│ └── config/ # Konfigurasi koneksi database
│
├── postman/ # Dokumentasi API (Collection & Environment)
│ ├── User_Management_API.postman_collection.json
│ └── User_Management_API.postman_environment.json
│
├── user_management_db.sql # Struktur dan data awal database
├── package.json
├── index.js
└── README.md
``` 
---

## ⚙️ Setup Project

### 1. Clone Repository 
git clone https://github.com/username/user_management_api.git
cd user_management_api 

### 2. Install Dependencies 
npm install

### 3. Konfigurasi Environment ### 
Buat file .env di root folder dengan isi:

PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=user_management_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_secret_key

### 4. Jalankan Server ###  
npm start

// Atau jika menggunakan nodemon:
npm run dev


## 🧾API Documentation (Postman)
Dokumentasi lengkap tersedia dalam folder postman/

Langkah Import ke Postman:
1. Buka aplikasi Postman
2. Klik Import
3. Pilih file:
   User_Management_API.postman_collection.json
   User_Management_API.postman_environment.json
4. Jalankan request sesuai urutan yang tersedia.
5. Atau kamu bisa publish dokumentasi API kamu langsung dari Postman ke link publik agar mudah dibaca (https://hello-annisadesca-1770279.postman.co/workspace/Annisa-Desca-Rachmadilla)

## 🧠 Developer Notes
- Gunakan JWT token di header Authorization: Bearer <token>
- Password dienkripsi dengan bcrypt
- Validasi input menggunakan middleware sederhana
- API dirancang dengan arsitektur modular agar mudah dikembangkan


## 👩‍💻 Author
Annisa Desca Rachmadilla 

