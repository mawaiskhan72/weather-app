// DOM Elements
const button = document.getElementById("search-button");
const input = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const cityTemp = document.getElementById("city-temp");
const weatherDesc = document.getElementById("weather-desc");
const cityTime = document.getElementById("city-time");

// Coordinates for major cities in Pakistan
const pakistanCities = {
    'islamabad': { lat: 33.6844, lng: 73.0479 },
    'karachi': { lat: 24.8607, lng: 67.0011 },
    'lahore': { lat: 31.5204, lng: 74.3587 },
    'peshawar': { lat: 34.0151, lng: 71.5249 },
    'quetta': { lat: 30.1798, lng: 66.9750 },
    'multan': { lat: 30.1575, lng: 71.5249 },
    'faisalabad': { lat: 31.4504, lng: 73.1350 },
    'rawalpindi': { lat: 33.5651, lng: 73.0169 },
    'hyderabad': { lat: 25.3960, lng: 68.3578 },
    'gujranwala': { lat: 32.1877, lng: 74.1945 },
    'dera ismail khan': { lat: 31.8315, lng: 70.9017 },
    'd i khan': { lat: 31.8315, lng: 70.9017 },
    'abbottabad': { lat: 34.1463, lng: 73.2117 }
};

// Get weather data from Open-Meteo API
async function getWeather(city) {
    const cityData = pakistanCities[city.toLowerCase()];
    if (!cityData) {
        throw new Error('City not found. Try: ' + Object.keys(pakistanCities).join(', '));
    }

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lng}&current_weather=true&timezone=auto`
    );
    
    if (!response.ok) {
        throw new Error('Weather data not available');
    }
    
    const data = await response.json();
    return {
        temperature: data.current_weather.temperature,
        time: new Date(data.current_weather.time),
        weatherCode: data.current_weather.weathercode
    };
}

// Get weather description from weather code
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown weather';
}

// Update UI with weather data
function updateUI(city, data) {
    const now = new Date(); // Get current local time
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    cityName.textContent = `${city.charAt(0).toUpperCase() + city.slice(1)}, Pakistan`;
    cityTemp.textContent = `${Math.round(data.temperature)}`;
    weatherDesc.textContent = getWeatherDescription(data.weatherCode);
    cityTime.textContent = `${dateString} • ${timeString}`;
}

// Event listener for search button
button.addEventListener("click", async () => {
    const city = input.value.trim().toLowerCase();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const weatherData = await getWeather(city);
        updateUI(city, weatherData);
    } catch (error) {
        alert(error.message || 'Error fetching weather data. Please try again.');
        console.error(error);
    }
});

// Allow search on Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        button.click();
    }
});