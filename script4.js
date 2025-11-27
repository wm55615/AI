const apiKey = "2aa61dd421754bb897d9b935e9f71ef0"; // użyj własnego po aktywacji

const btn = document.getElementById("weatherBtn");
const cityInput = document.getElementById("cityInput");
const currentDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");

btn.addEventListener("click", () => {
    const city = cityInput.value;
    if (!city) return;

    // --- XMLHttpRequest ---
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`
    );

    xhr.onload = () => {
        
        const data = JSON.parse(xhr.responseText);
        console.log("XML PARSED :", data);

        currentDiv.innerHTML = `<h2>Weather now:</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Description: ${data.weather[0].description}</p>
            <p>Feels like: ${data.main.feels_like}°C</p>`;
    };

    xhr.send();

    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`
    )
        .then((res) => {
            console.log("Fetch RAW response:", res);
            return res.json();
        })
        .then((data) => {

            let html = "<h2>Forecast:</h2>";
            data.list.slice(0, 5).forEach((entry) => {
                html += `<p><strong>${entry.dt_txt}</strong>: ${entry.main.temp}°C, ${entry.weather[0].description}</p>`;
            });

            forecastDiv.innerHTML = html;
        })
        .catch(err => console.error("error:", err));
});
