class WeatherApp {
    constructor() {
        this.API_KEY = "af9df8c432b34fb885f2389dfe14ffb0";
        this.currentUnit = 'metric';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.createWeatherParticles();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
    }

    setupEventListeners() {
        // Search input
        const cityInput = document.getElementById('cityInput');
        cityInput.addEventListener('input', (e) => this.handleSearchInput(e));
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather(e.target.value);
        });

        // Unit toggle
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleUnit(e));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            const cityInput = document.getElementById('cityInput');
            this.searchWeather(cityInput.value);
        });

        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => this.getCurrentLocation());

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('weather-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('weather-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    createWeatherParticles() {
        const particlesContainer = document.getElementById('weatherParticles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 3;
            const delay = Math.random() * 2;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${Math.random() * 100}%;
                animation-duration: ${animationDuration}s;
                animation-delay: ${delay}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    async handleSearchInput(e) {
        const query = e.target.value.trim();
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.searchTimeout = setTimeout(async () => {
            await this.showSuggestions(query);
        }, 300);
    }

    async showSuggestions(query) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.API_KEY}`
            );
            const cities = await response.json();

            const suggestionsContainer = document.getElementById('searchSuggestions');
            
            if (cities.length === 0) {
                this.hideSuggestions();
                return;
            }

            suggestionsContainer.innerHTML = cities.map(city => `
                <div class="suggestion-item" onclick="weatherApp.selectCity('${city.name}', '${city.country}', ${city.lat}, ${city.lon})">
                    <strong>${city.name}</strong>, ${city.state ? city.state + ', ' : ''}${city.country}
                </div>
            `).join('');

            suggestionsContainer.style.display = 'block';
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideSuggestions();
        }
    }

    hideSuggestions() {
        document.getElementById('searchSuggestions').style.display = 'none';
    }

    selectCity(name, country, lat, lon) {
        document.getElementById('cityInput').value = `${name}, ${country}`;
        this.hideSuggestions();
        this.getWeatherByCoords(lat, lon);
    }

    toggleUnit(e) {
        document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentUnit = e.target.dataset.unit;
        
        // Refresh weather data if available
        const dashboard = document.getElementById('weatherDashboard');
        if (dashboard.style.display !== 'none') {
            const cityInput = document.getElementById('cityInput');
            if (cityInput.value) {
                this.searchWeather(cityInput.value);
            }
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.getWeatherByCoords(latitude, longitude);
            },
            (err) => {
                this.hideLoading();
                this.showError('Unable to retrieve your location. Please search manually.');
                console.error('Geolocation error:', err);
            }
        );
    }

    async searchWeather(query) {
        if (!query.trim()) {
            this.showError('Please enter a city name.');
            return;
        }

        this.showLoading();

        try {
            const geoResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.API_KEY}`
            );
            const geoData = await geoResponse.json();

            if (geoData.length === 0) {
                throw new Error('City not found');
            }

            const { lat, lon } = geoData[0];
            await this.getWeatherByCoords(lat, lon);
        } catch (error) {
            this.hideLoading();
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async getWeatherByCoords(lat, lon) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnit}`),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnit}`)
            ]);

            const currentData = await currentWeather.json();
            const forecastData = await forecast.json();

            if (currentData.cod !== 200) {
                throw new Error(currentData.message);
            }

            this.displayWeather(currentData, forecastData);
            this.updateWeatherParticles(currentData.weather[0].main);
            this.hideLoading();
            this.hideError();
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to fetch weather data. Please try again.');
            console.error('Weather API Error:', error);
        }
    }

    displayWeather(current, forecast) {
        // Update current weather
        document.getElementById('currentLocation').textContent = `${current.name}, ${current.sys.country}`;
        document.getElementById('currentTemp').textContent = `${Math.round(current.main.temp)}°`;
        document.getElementById('weatherDescription').textContent = current.weather[0].description;
        document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°`;
        document.getElementById('currentWeatherIcon').src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        document.getElementById('currentWeatherIcon').alt = current.weather[0].description;

        // Update stats
        document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
        document.getElementById('humidity').textContent = `${current.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${current.wind.speed} ${this.currentUnit === 'metric' ? 'm/s' : 'mph'}`;
        document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;

        // Update sun times
        document.getElementById('sunrise').textContent = new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        document.getElementById('sunset').textContent = new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Update forecast
        this.displayForecast(forecast);

        // Show dashboard
        document.getElementById('weatherDashboard').style.display = 'block';
    }

    displayForecast(forecast) {
        const forecastContainer = document.getElementById('forecastContainer');
        const dailyForecasts = this.processForecastData(forecast.list);

        forecastContainer.innerHTML = dailyForecasts.map(day => `
            <div class="forecast-item">
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
                </div>
                <div class="forecast-temps">
                    <span class="forecast-high">${Math.round(day.high)}°</span>
                    <span class="forecast-low">${Math.round(day.low)}°</span>
                </div>
                <div class="forecast-desc">${day.description}</div>
            </div>
        `).join('');
    }

    processForecastData(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = {
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    high: item.main.temp_max,
                    low: item.main.temp_min,
                    icon: item.weather[0].icon,
                    description: item.weather[0].description
                };
            } else {
                dailyData[dayKey].high = Math.max(dailyData[dayKey].high, item.main.temp_max);
                dailyData[dayKey].low = Math.min(dailyData[dayKey].low, item.main.temp_min);
            }
        });

        return Object.values(dailyData).slice(0, 5);
    }

    updateWeatherParticles(weatherType) {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            particle.style.background = this.getParticleColor(weatherType);
        });
    }

    getParticleColor(weatherType) {
        const colors = {
            'Clear': 'rgba(255, 215, 0, 0.3)',
            'Clouds': 'rgba(255, 255, 255, 0.2)',
            'Rain': 'rgba(100, 149, 237, 0.4)',
            'Snow': 'rgba(255, 255, 255, 0.6)',
            'Thunderstorm': 'rgba(75, 0, 130, 0.4)',
            'Drizzle': 'rgba(135, 206, 235, 0.3)',
            'Mist': 'rgba(192, 192, 192, 0.3)',
            'Fog': 'rgba(169, 169, 169, 0.4)'
        };
        
        return colors[weatherType] || 'rgba(255, 255, 255, 0.1)';
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('weatherDashboard').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.querySelector('p').textContent = message;
        errorElement.style.display = 'block';
        document.getElementById('weatherDashboard').style.display = 'none';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }
}

// Initialize the app
const weatherApp = new WeatherApp();

// Add smooth interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .suggestion-item, .forecast-item, .stat-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('scale')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (!this.style.transform.includes('scale')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
