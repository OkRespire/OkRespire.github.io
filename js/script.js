function getWeatherDescription(code) {
  const codes = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Depositing rime fog 🌫️❄️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌧️",
    55: "Dense drizzle 🌧️",
    61: "Slight rain 🌧️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain 🌧️",
    71: "Slight snow ❄️",
    73: "Moderate snow ❄️",
    75: "Heavy snow ❄️",
    80: "Rain showers 🌦️",
    81: "Moderate showers 🌧️",
    82: "Violent showers ⛈️",
    95: "Thunderstorm 🌩️",
    96: "Thunderstorm with hail ⛈️",
    99: "Severe thunderstorm with hail ⛈️⚠️",
  };
  return codes[code] || "Unknown";
}

function isLoggedIn() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  let container = document.querySelectorAll(".invisible-container");
  let visibleContainer = document.querySelectorAll(".non-invisible-container");

  visibleContainer.forEach((el) => {
    el.style.display = isLoggedIn ? "none" : "block";
  });

  container.forEach((el) => {
    el.style.display = isLoggedIn ? "block" : "none";
  });
}

function checkLogin(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  if (email === "john@gmail.com" && password === "password123") {
    alert("Login successful!");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "profile.html";
  } else {
    document.getElementById("error").textContent = "Invalid email or password.";
  }
}

function signout() {
  localStorage.setItem("isLoggedIn", "false");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!window.location.pathname.endsWith("weather.html")) return;
  const picker = document.getElementById("datePicker");
  const api_url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,sunrise,uv_index_max,sunset,weather_code&hourly=temperature_2m,relative_humidity_2m,weather_code&current=temperature_2m,relative_humidity_2m&timezone=auto";

  if (!picker) return;
  picker.addEventListener("change", async function () {
    const selected = this.value;
    const dailySummary = document.getElementById("daily-summary");
    dailySummary.style.display = "block";
    document.querySelector(
      "#daily-summary a"
    ).href = `daily_weather.html?date=${selected}`;

    try {
      let response = await fetch(api_url);
      let data = await response.json();

      const idx = data.daily.time.indexOf(selected);
      if (idx == -1) {
        alert("No weather data available");
        return;
      }
      const weatherCode = data.daily.weather_code[idx];
      const weatherDesc = getWeatherDescription(weatherCode);

      document.getElementById(
        "summary"
      ).innerHTML = `<strong>Condition:</strong> ${weatherDesc}<br><strong>High:</strong> ${data.daily.temperature_2m_max[idx]}°C, <strong>Low:</strong> ${data.daily.temperature_2m_min[idx]}°C`;

      document.getElementById(
        "uv"
      ).innerHTML = `<strong>UV Index:</strong> ${data.daily.uv_index_max[idx]}`;

      document.getElementById(
        "humidity"
      ).innerHTML = `<strong>Humidity:</strong> ${data.hourly.relative_humidity_2m[idx]}%`;

      document.getElementById(
        "sunrise"
      ).innerHTML = `<strong>Sunrise:</strong> ${
        data.daily.sunrise[idx].split("T")[1]
      }`;

      document.getElementById("sunset").innerHTML = `<strong>Sunset:</strong> ${
        data.daily.sunset[idx].split("T")[1]
      }`;
      const times = data.hourly.time;
      const temps = data.hourly.temperature_2m;
      const humidities = data.hourly.relative_humidity_2m;
      const weather = data.hourly.weather_code;

      const container = document.getElementById("hourlyContainer");
      container.innerHTML = "";
      container.style.display = "flex";
      container.style.flexDirection = "row";
      container.style.overflowX = "auto";
      container.style.gap = "1rem";

      const maxHours = 12;
      for (let i = 0; i < Math.min(times.length, maxHours); i++) {
        const card = document.createElement("div");
        card.className = "card p-2 mb-2";
        card.style.minWidth = "200px";
        card.style.flex = "0 0 auto";

        card.innerHTML = `
            <strong>${times[i].split("T")[1]}</strong><br/>
            Temp: ${temps[i]}°C<br/>
            Humidity: ${humidities[i]}%<br/>
            ${getWeatherDescription(weather[i])}
          `;
        container.appendChild(card);
      }
      const showMoreButton = document.getElementById("showMoreButton");
      showMoreButton.style.display = "none"; // Hide by default

      if (times.length > maxHours) {
        showMoreButton.style.display = "inline-block";
        showMoreButton.onclick = function () {
          for (let i = maxHours; i < times.length; i++) {
            const card = document.createElement("div");
            card.className = "card p-2 mb-2";
            card.style.minWidth = "200px";
            card.style.flex = "0 0 auto";
            card.innerHTML = `
          <strong>${times[i].split("T")[1]}</strong><br/>
          Temp: ${temps[i]}°C<br/>
          Humidity: ${humidities[i]}%
          Weather: ${getWeatherDescription(weather)}
        `;
            container.appendChild(card);
          }
          showMoreButton.style.display = "none";
        };
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Hi");
  if (!window.location.pathname.endsWith("daily_weather.html")) return;
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");

  const detailsDiv = document.getElementById("weather_details");

  if (!date) {
    detailsDiv.innerHTML = "<p>No date provided in URL.</p>";
    return;
  }

  const api_url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,sunrise,uv_index_max,sunset,weather_code&hourly=temperature_2m,relative_humidity_2m,weather_code&current=temperature_2m,relative_humidity_2m&timezone=auto";

  try {
    const response = await fetch(api_url);
    const data = await response.json();

    const idx = data.daily.time.indexOf(date);
    if (idx === -1) {
      document.body.innerHTML =
        "<p>No weather data available for this date.</p>";
      return;
    }
    const weatherCode = data.daily.weather_code[idx];
    const weatherDesc = getWeatherDescription(weatherCode);

    detailsDiv.innerHTML = `
    <h4>Weather for ${date}</h4>
    <h3>Current Weather: ${weatherDesc}</h3>

      <div class="row justify-content-center g-4 mt-5">
          <div class="col-md-4">
            <div class="card h-100"> 
              <div class="card-body text-center d-flex flex-column">
                <p class="card-text flex-grow-1"> 🌡️ High: ${
                  data.daily.temperature_2m_max[idx]
                }°C</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <p class="card-text flex-grow-1">🌡️ Low: ${
                  data.daily.temperature_2m_min[idx]
                }°C</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <p class="card-text flex-grow-1"> ☀️ Sunrise: ${
                  data.daily.sunrise[idx].split("T")[1]
                }</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <p class="card-text flex-grow-1"> ☀🌇 Sunset: ${
                  data.daily.sunset[idx].split("T")[1]
                }</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <p class="card-text flex-grow-1">🔆 UV Index: ${
                  data.daily.uv_index_max[idx]
                }</p>
              </div>
            </div>
          
      </div>
     <h5>Hourly Weather (Temperature & Humidity)</h5>
  <div class="row row-cols-1 row-cols-md-3 g-3">
    ${data.hourly.time
      .map((time, i) => {
        if (!time.startsWith(date)) return "";
        return `
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="card-title">${time.split("T")[1]}</h6>
                <p class="card-text">🌡️${
                  data.hourly.temperature_2m[i]
                }°C<br/>💧 ${data.hourly.relative_humidity_2m[i]}%<br/>
                ${getWeatherDescription(data.hourly.weather_code[i])}
                </p>
              </div>
            </div>
          </div>
        `;
      })
      .join("")}
  </div>
  `;
  } catch (error) {
    console.error("Failed to fetch weather data", error);
  }
});

document.addEventListener("DOMContentLoaded", isLoggedIn);

// ☁️ ${getWeatherDescription(data.hourly.weather_code[i])}
