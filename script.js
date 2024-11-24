const apiKey = "7f60d87b4100a8c1d36ddefc531874bd";

document.getElementById("getWeather").addEventListener("click", () => {
    const address = document.getElementById("address").value.trim();
    if (!address) {
        alert("Proszę wprowadzić lokalizację.");
        return;
    }
    getCurrentWeather(address);
    getWeatherForecast(address);
});

function getCurrentWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            displayCurrentWeather(data);
        } else {
            alert("Nie udało się pobrać danych o bieżącej pogodzie.");
        }
    };
    xhr.send();
}

function getWeatherForecast(location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Nie udało się pobrać danych o prognozie pogody.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayWeatherForecast(data);
        })
        .catch(error => alert(error.message));
}

function displayCurrentWeather(data) {
    const display = document.getElementById("weatherDisplay");
    display.innerHTML = `
        <div class="current-weather">
            <h2>Pogoda w ${data.name}</h2>
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Warunki: ${data.weather[0].description}</p>
            <p>Wilgotność: ${data.main.humidity}%</p>
            <p>Prędkość wiatru: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayWeatherForecast(data) {
    const display = document.getElementById("weatherDisplay");

    const dailyForecast = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    function getWeatherIcon(description) {
        description = description.toLowerCase();
        if (description.includes("bezchmurnie") || description.includes("clear")) return "☀️";
        if (description.includes("zachmurzenie duże") || description.includes("overcast clouds")) return "🌥️";
        if (description.includes("zachmurzenie umiarkowane") || description.includes("broken clouds")) return "🌤️";
        if (description.includes("zachmurzenie") || description.includes("clouds")) return "☁️";
        if (description.includes("deszcz") || description.includes("rain")) return "🌧️";
        if (description.includes("burza") || description.includes("thunderstorm")) return "⛈️";
        if (description.includes("śnieg") || description.includes("snow")) return "❄️";
        if (description.includes("mgła") || description.includes("fog")) return "🌫️";
        return "🌫️";
    }


    const forecastHTML = Object.keys(dailyForecast)
        .map(date => {
            const dayData = dailyForecast[date];
            const temperatures = dayData.map(item => item.main.temp);
            const minTemp = Math.min(...temperatures);
            const maxTemp = Math.max(...temperatures);
            const description = dayData[0].weather[0].description;
            const weatherIcon = getWeatherIcon(description.toLowerCase());

            return `
                <div class="forecast-day">
                    <h3>${new Date(date).toLocaleDateString("pl-PL")}</h3>
                    <p>${weatherIcon} Warunki: ${description}</p>
                    <p>Min. temperatura: <span class='min-temp'>${minTemp}°C</span></p>
                    <p>Max. temperatura: <span class='max-temp'>${maxTemp}°C</span></p>
                </div>
            `;
        })
        .join("");

    display.innerHTML += `
        <h2>Pogoda na 5 dni</h2>
        ${forecastHTML}
    `;
}
