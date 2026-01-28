# WhatsNep - Aplikasi Chat Modern & Aman

![WhatsNep Logo](public/favicon.svg)

WhatsNep adalah aplikasi chat web modern yang dibangun dengan React, Vite, dan Supabase. Aplikasi ini mengutamakan kemudahan penggunaan, keamanan, dan desain UI/UX yang indah.

## ✨ Fitur Utama

- 🔐 **Autentikasi Aman** - Registrasi dan login dengan Supabase Auth
- 💬 **Real-time Chat** - Pesan terkirim dan diterima secara instan
- 👥 **Direct Messaging** - Chat pribadi antar pengguna
- 🔍 **Pencarian User** - Temukan pengguna lain dengan mudah
- 🟢 **Status Online** - Lihat siapa yang sedang online
- ✅ **Read Receipts** - Tanda pesan sudah dibaca
- 🔔 **Notifikasi Browser** - Dapatkan notifikasi pesan baru
- 📱 **Responsive Design** - Tampil sempurna di semua perangkat
- 🎨 **Dark Mode** - Tema gelap yang nyaman untuk mata
- 🔒 **Auto Logout** - Keamanan ekstra dengan session-based authentication

## 🛠️ Tech Stack

- **Frontend**: React 19.x + Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **Animasi**: Framer Motion 12.x
- **Backend**: Supabase (Database + Auth + Realtime)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Utils**: date-fns untuk format tanggal

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- Node.js 18.x atau lebih baru
- npm atau yarn
- Akun Supabase (gratis) - [Sign up di sini](https://supabase.com)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/zhafran12382/WhatsNep.git
cd WhatsNep
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### 3.1 Buat Project di Supabase

1. Buka [supabase.com](https://supabase.com) dan login
2. Klik "New Project"
3. Isi detail project Anda
4. Tunggu hingga project selesai dibuat

#### 3.2 Jalankan SQL Schema

1. Di dashboard Supabase, buka **SQL Editor**
2. Copy seluruh isi file `supabase-schema.sql`
3. Paste ke SQL Editor dan klik **Run**
4. Tunggu hingga semua tabel dan fungsi berhasil dibuat

#### 3.3 Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

2. Buka file `.env` dan isi dengan credentials Supabase Anda:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan credentials:**
- Di dashboard Supabase, buka **Settings** → **API**
- Copy **Project URL** untuk `VITE_SUPABASE_URL`
- Copy **anon public** key untuk `VITE_SUPABASE_ANON_KEY`

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📦 Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`

## 🎯 Cara Menggunakan

### Registrasi Akun Baru

1. Buka aplikasi di browser
2. Klik **"Mulai Sekarang"** atau **"Daftar"**
3. Isi username (unik), email, dan password
4. Username akan dicek secara real-time untuk ketersediaan
5. Password strength indicator akan membantu Anda membuat password yang kuat
6. Klik **"Daftar"**

### Login

1. Masukkan email dan password Anda
2. Klik **"Masuk"**
3. Anda akan diarahkan ke dashboard chat

### Mulai Chat

1. Klik tombol **"Chat Baru"** di sidebar
2. Cari username pengguna yang ingin Anda ajak chat
3. Klik pada pengguna tersebut
4. Mulai mengirim pesan!

### Fitur Lainnya

- **Lihat Status Online**: Indikator hijau menunjukkan user sedang online
- **Read Receipts**: Centang ganda berarti pesan sudah dibaca
- **Notifikasi**: Izinkan notifikasi browser untuk mendapat alert pesan baru
- **Ubah Password**: Buka Settings untuk mengganti password

## 📁 Struktur Folder

```
whatsnep/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Auth/           # Komponen autentikasi
│   │   ├── Chat/           # Komponen chat
│   │   ├── Layout/         # Komponen layout
│   │   └── UI/             # Komponen UI reusable
│   ├── contexts/           # React Context (Auth & Chat)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library configs (Supabase)
│   ├── pages/              # Halaman utama aplikasi
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component dengan routing
│   └── main.jsx            # Entry point
├── .env.example            # Template environment variables
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json
├── postcss.config.js
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
├── supabase-schema.sql     # Database schema
└── README.md
```

## 🔒 Keamanan

WhatsNep mengimplementasikan berbagai fitur keamanan:

- **Session-based Authentication**: Auto logout saat browser/tab ditutup
- **Password Encryption**: Handled oleh Supabase Auth
- **Input Sanitization**: Semua input di-sanitize untuk mencegah XSS
- **Row Level Security (RLS)**: Database policies untuk akses data yang aman
- **Protected Routes**: Halaman dilindungi dengan authentication check

## 🎨 Customization

### Ubah Warna Tema

Edit file `tailwind.config.js`:

```javascript
colors: {
  primary: { /* warna primary Anda */ },
  accent: {
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    teal: '#14b8a6',
  }
}
```

### Ubah Font

Edit file `tailwind.config.js` dan `src/styles/globals.css`

## 🐛 Troubleshooting

### Error: "Supabase URL not configured"

- Pastikan file `.env` sudah dibuat dan berisi credentials yang benar
- Restart development server setelah membuat/mengubah `.env`

### Error saat login/register

- Cek apakah SQL schema sudah dijalankan dengan benar
- Pastikan RLS policies sudah dibuat
- Lihat console browser untuk error details

### Messages tidak real-time

- Pastikan Realtime sudah diaktifkan di Supabase
- Cek di Supabase Dashboard → Database → Replication
- Pastikan tabel `messages` ada dalam replication

## 📝 License

MIT License - lihat file [LICENSE](LICENSE) untuk details.

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan GitHub Copilot

## 🤝 Contributing

Contributions, issues, dan feature requests sangat diterima!

## 📞 Support

Jika Anda mengalami masalah atau punya pertanyaan:

1. Cek bagian [Troubleshooting](#-troubleshooting) di atas
2. Buka issue di GitHub repository
3. Baca dokumentasi [Supabase](https://supabase.com/docs)

---

⭐ Jangan lupa beri bintang jika project ini bermanfaat!
