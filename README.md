# SkyGlass Weather Monitoring

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![OpenMeteo](https://img.shields.io/badge/OpenMeteo-API-FF6B35?style=for-the-badge&logo=openstreetmap&logoColor=white)

</div>

SkyGlass is a modern weather dashboard designed to deliver real-time weather insights through a polished glassmorphism interface. The application combines location search, forecast data, air quality readings, and personalized user preferences into a single, user-friendly experience.

## Overview

SkyGlass provides weather information for selected locations with a premium interface and responsive layout. It enables users to:

- Search for cities using autocomplete suggestions
- View current weather conditions and hourly forecasts
- Switch between Celsius and Fahrenheit units
- Check air quality and UV index information
- Save recent searches and user preferences locally
- Experience a visually rich dashboard built around a glass-inspired design system

## Tech Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- Styling: Custom CSS, Glassmorphism design system
- Backend: Node.js, Express
- Database: SQLite with better-sqlite3
- APIs: Open-Meteo Geocoding, Weather, and Air Quality APIs
- Runtime: Node.js 18+
- Package Manager: npm

## Features

- City search with autocomplete and location ranking
- Current weather display with temperature, humidity, and wind metrics
- Hourly forecast strip for short-term weather tracking
- Temperature unit switching between C and F
- AQI and air-quality monitoring
- UV index and visibility indicators
- Recent search persistence using local SQLite storage
- Responsive dashboard layout for desktop and mobile browsing

## Architecture

The application follows a simple layered architecture:

- Frontend assets are served from the public directory
- Express routes handle incoming HTTP requests
- Service modules manage business logic and external API calls
- SQLite stores user preferences and recent search history

## Project Structure

```text
SkyGlass-Weather-Monitoring/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── particles.js
├── server/
│   ├── index.js
│   ├── database.js
│   ├── controllers/
│   ├── routes/
│   │   ├── city.routes.js
│   │   ├── geocode.routes.js
│   │   ├── preference.routes.js
│   │   ├── search.routes.js
│   │   └── weather.routes.js
│   ├── services/
│   │   ├── city.service.js
│   │   ├── geocode.service.js
│   │   ├── preference.service.js
│   │   ├── search.service.js
│   │   └── weather.service.js
│   └── utils/
├── .gitignore
├── DESIGN.md
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

## Prerequisites

Make sure the following are installed on your machine:

- Node.js 18 or later
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/77ferdian/SkyGlass-Weather-Monitoring.git
cd SkyGlass-Weather-Monitoring
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

Start the server:

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

## API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/weather` | GET | Fetch weather data based on latitude and longitude |
| `/api/weather/:location` | GET | Fetch weather data by city name |
| `/api/geocode` | GET | Get city recommendations based on user input |
| `/api/cities` | GET, POST, DELETE | Manage saved city records |
| `/api/searches` | GET, POST | Retrieve and store recent search entries |
| `/api/preferences` | GET, POST | Manage user preferences such as temperature unit |

## Example Requests

Weather by coordinates:

```bash
curl "http://localhost:3000/api/weather?lat=-6.2088&lon=106.8456"
```

Geocoding search:

```bash
curl "http://localhost:3000/api/geocode?q=jakarta"
```

## Notes

This project uses the Open-Meteo API for weather and geocoding data, which provides reliable and lightweight access to forecast and location information without needing a custom backend infrastructure for everything.

## License

This project is licensed under the ISC License.

## Author

77ferdian

## Contributing

Contributions are welcome. If you would like to improve the user interface, add new weather widgets, or optimize the API layer, please open an issue or submit a pull request.
