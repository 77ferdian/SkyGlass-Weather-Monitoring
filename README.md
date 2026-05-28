# 🌤️ SkyGlass - Weather Dashboard

SkyGlass is a premium, state-of-the-art weather forecasting dashboard built with a gorgeous modern Glassmorphism theme ("Atmospheric Glass"). It features highly detailed real-time weather metrics, debounced search recommendations, horizontal hourly forecasts, and localized MSN-style health and life widgets (Air Quality Index, UV Index, and Sun Cycle).

---

## 📋 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Arsitektur & Teknologi](#-arsitektur--teknologi)
3. [Prasyarat](#-prasyarat)
4. [Instalasi & Penggunaan](#-instalasi--penggunaan)
5. [Struktur Proyek](#-struktur-proyek)
6. [API Endpoints](#-api-endpoints)

---

## ✨ Fitur Utama

- **🔍 Debounced Search Autocomplete:** Suggestions appear as you type with flag icons and population-based prioritization (e.g. Jakarta shows up first for "jak").
- **🌡️ Unit Temperature Switcher:** Fast toggling between Celsius (°C) and Fahrenheit (°F) with animated transition and full forecast update.
- **🕒 Hourly Forecast Strip:** A horizontal, snap-scrolling strip containing weather conditions, temperature, and precipitation chance for the next 24 hours.
- **🍃 Air Quality (AQI) Widget:** Tracks US Air Quality Index (AQI), status rating (Good, Moderate, Unhealthy, Hazardous), and PM2.5/PM10 levels.
- **☀️ UV Index Gauge:** Highlights the daily maximum UV level with visual progress tracking.
- **🌅 Sun Cycle & Visibility:** Visualizes local sunrise/sunset times and current visibility values.
- **💾 Recent Search Persistence:** Automatic logging of recent searches backed by SQLite for fast recall.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend:** Vanilla JS, Tailwind CSS, Google Material Symbols, Custom Glassmorphism styling.
- **Backend:** Node.js, Express, CORS.
- **Database:** SQLite via `better-sqlite3` for local state/preference persistence.
- **APIs:** Open-Meteo Weather API, Open-Meteo Air Quality API, Open-Meteo Geocoding API.

---

## 🔧 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Node.js** (versi 18+)
- **npm**

---

## 📦 Instalasi & Penggunaan

### 1. Clone atau Buka Proyek
Navigasi ke direktori proyek:
```bash
cd "d:\Coding Folder\SkyGlass"
```

### 2. Instal Dependency
Jalankan perintah berikut untuk menginstal package yang diperlukan:
```bash
npm install
```

### 3. Menjalankan Server
```bash
npm start
```
Server akan berjalan di: **`http://localhost:3000`**

---

## 📁 Struktur Proyek

```text
SkyGlass/
├── public/                 # Frontend Static Assets
│   ├── index.html         # Main dashboard layout
│   ├── css/
│   │   └── style.css      # Custom glassmorphism styles
│   └── js/
│       ├── app.js         # Core frontend JS & DOM bindings
│       └── particles.js   # Background floating particle effect
├── server/                # Express Backend
│   ├── index.js           # App entrypoint
│   ├── database.js        # SQLite setup & connection
│   ├── controllers/       # Controller handlers
│   ├── routes/            # Route declarations
│   ├── services/          # Business logic and external API integrations
│   └── utils/             # Helper functions
└── data/                  # SQLite database directory
```

---

## 🌐 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/weather` | GET | Ambil cuaca berdasarkan latitude & longitude (`?lat={lat}&lon={lon}`) |
| `/api/weather/:location` | GET | Ambil cuaca berdasarkan nama kota |
| `/api/geocode` | GET | Dapatkan rekomendasi kota berdasarkan input pencarian (`?q={query}`) |
| `/api/cities` | GET/POST/DELETE | Kelola daftar kota tersimpan |
| `/api/searches` | GET/POST | Dapatkan atau simpan riwayat pencarian terbaru |
| `/api/preferences` | GET/POST | Kelola pengaturan preferensi unit (°C / °F) |

---
Happy Coding! 🎉
