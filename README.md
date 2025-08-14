# WeatherVibe 🌤️

A modern, responsive weather application built with vanilla JavaScript, featuring a stunning glassmorphism design and advanced weather forecasting capabilities.

## ✨ Features

### 🎨 Modern UI/UX

- **Glassmorphism Design** - Beautiful frosted glass effects with backdrop blur
- **Animated Background** - Dynamic particle system that adapts to weather conditions
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **Responsive Design** - Optimized for all devices and screen sizes

### 🌍 Weather Features

- **Current Weather** - Real-time weather data with detailed metrics
- **5-Day Forecast** - Extended weather predictions with daily highs/lows
- **Geolocation Support** - One-click location detection for instant weather
- **Smart Search** - Autocomplete city suggestions as you type
- **Multiple Units** - Switch between Celsius and Fahrenheit

### 🚀 Advanced Functionality

- **Real-time Updates** - Live date/time display
- **Weather Particles** - Background effects change based on weather conditions
- **Smooth Animations** - CSS transitions and micro-interactions
- **Error Handling** - Graceful error messages and loading states
- **Local Storage** - Remembers your theme preference

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - ES6+ features, async/await, and class-based architecture
- **OpenWeatherMap API** - Weather data and geocoding services
- **Font Awesome** - Icon library
- **Google Fonts** - Inter typography

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Yameen05/weathervibe.git
   cd weathervibe
   ```

2. **Add your API key**

   - Open `script.js`
   - Replace `"af9df8c432b34fb885f2389dfe14ffb0"` with your OpenWeatherMap API key

   ```javascript
   this.API_KEY = "your_api_key_here";
   ```

3. **Launch the application**

   - Open `index.html` in your web browser
   - Or use a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```

## 📱 Usage

### Search for Weather

1. Type a city name in the search bar
2. Select from autocomplete suggestions or press Enter
3. Click the search button to get weather data

### Use Current Location

- Click the location button (📍) in the top navigation
- Allow location access when prompted
- Weather data for your current location will load automatically

### Switch Units

- Use the °C/°F toggle in the search bar to switch temperature units
- Data will refresh automatically with the new unit

### Toggle Theme

- Click the theme button (🌙/☀️) in the top navigation
- Your preference is saved locally

## 🎯 Key Features Breakdown

### Weather Data Display

- **Current Temperature** - Large, prominent display with gradient text
- **Weather Description** - Capitalized weather conditions
- **Feels Like** - Apparent temperature
- **Detailed Stats** - Humidity, wind speed, pressure, visibility
- **Sun Times** - Sunrise and sunset with local time formatting

### 5-Day Forecast

- **Daily Cards** - Individual forecast items with hover effects
- **Weather Icons** - Official OpenWeatherMap icons
- **High/Low Temps** - Daily temperature ranges
- **Conditions** - Weather descriptions for each day

### Interactive Elements

- **Hover Effects** - Smooth transitions on interactive elements
- **Loading States** - Spinner animation during API calls
- **Error Handling** - User-friendly error messages
- **Ripple Effects** - Button click animations

## 🎨 Design System

### Color Palette

- **Primary Gradient** - Purple to blue (`#667eea` → `#764ba2`)
- **Secondary Gradient** - Pink to red (`#f093fb` → `#f5576c`)
- **Glass Effects** - Semi-transparent overlays with backdrop blur
- **Text Colors** - White with varying opacity levels

### Typography

- **Font Family** - Inter (Google Fonts)
- **Font Weights** - 300, 400, 500, 600, 700
- **Responsive Sizing** - Scales appropriately across devices

## 📊 API Integration

### OpenWeatherMap APIs Used

1. **Current Weather API** - Real-time weather data
2. **5-Day Forecast API** - Extended weather predictions
3. **Geocoding API** - City name to coordinates conversion
4. **Reverse Geocoding API** - Location-based city detection

### Data Processing

- Temperature unit conversion
- Time zone handling for sunrise/sunset
- Weather condition mapping for particle effects
- Forecast data aggregation by day

## 🔧 Browser Support

- **Chrome** 60+
- **Firefox** 60+
- **Safari** 12+
- **Edge** 79+

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the Inter typeface
- Inspiration from modern weather apps and glassmorphism design trends

---

**Built with ❤️ by Yameen**
