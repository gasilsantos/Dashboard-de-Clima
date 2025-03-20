// Weather Dashboard JavaScript

// API Key for OpenWeather
const API_KEY = '5f923328dd55e5dbb4761014717f0d7a';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherCard = document.getElementById('weather-card');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Weather Data Elements
const cityName = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Event Listeners
searchButton.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Format date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Search weather data
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Por favor, digite o nome de uma cidade.');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        showError('Não foi possível encontrar dados para esta cidade. Verifique o nome e tente novamente.');
        hideWeatherCard();
    } finally {
        hideLoading();
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Cidade não encontrada');
    }
    
    return await response.json();
}

// Weather message element
const weatherMessage = document.getElementById('weather-message');
const weatherMessageText = weatherMessage.querySelector('p');

// Get personalized weather message
function getWeatherMessage(weatherData) {
    const temp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (condition === 'clear') {
        return '☀️ Hoje será um dia ensolarado! Aproveite!';
    } else if (condition === 'rain' && weatherData.rain) {
        return '☔ Prepare o guarda-chuva, chuva forte à vista!';
    } else if (condition === 'fog' || condition === 'mist') {
        return '🌫️ Cuidado ao dirigir, neblina à frente!';
    } else if (temp <= 10) {
        return '❄️ Dia gelado! Agasalhe-se bem!';
    } else if (condition === 'clouds') {
        return '☁️ Céu nublado hoje, fique atento às mudanças!';
    } else if (condition === 'thunderstorm') {
        return '⛈️ Tempestade à vista! Mantenha-se em local seguro!';
    } else if (condition === 'snow') {
        return '🌨️ Neve à vista! Vista-se adequadamente!';
    } else if (temp >= 30) {
        return '🌡️ Dia muito quente! Mantenha-se hidratado!';
    }
    
    return '🌈 Tenha um ótimo dia!';
}

// Display weather data
function displayWeatherData(data) {
    // Set city name and date
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    dateElement.textContent = formatDate(new Date());
    
    // Set temperature and description
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Set additional info
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    
    // Set weather message
    weatherMessageText.textContent = getWeatherMessage(data);
    weatherMessage.classList.remove('hidden');
    
    // Show weather card with animation
    weatherCard.classList.remove('hidden');
    weatherCard.classList.add('show');
}

// UI Helper Functions
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function hideWeatherCard() {
    weatherCard.classList.add('hidden');
    weatherCard.classList.remove('show');
}

// Initialize with a default city (optional)
window.addEventListener('DOMContentLoaded', () => {
    // Uncomment to load a default city on page load
    // cityInput.value = 'São Paulo';
    // searchWeather();
});