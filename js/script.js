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
  const picker = document.getElementById("datePicker");
  const api_url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,sunrise,uv_index_max,sunset&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m,relative_humidity_2m&timezone=auto";
  if (!picker) return;
  picker.addEventListener("change", async function () {
    const selected = this.value;
    const dailySummary = document.getElementById("daily-summary");
    dailySummary.style.display = "block";
    document.querySelector("#daily-summary a").href =
      `daily_weather.html?date=${selected}`;

    try {
      let response = await fetch(api_url);
      let data = await response.json();

      const idx = data.daily.time.indexOf(selected);
      if (idx == -1) {
        alert("No weather data available");
        return;
      }

      document.getElementById("summary").innerText =
        `High: ${data.daily.temperature_2m_max[idx]}°C, Low: ${data.daily.temperature_2m_min[idx]}°C`;
      document.getElementById("uv").innerText =
        `UV Index: ${data.daily.uv_index_max[idx]}`;
      document.getElementById("humidity").innerText =
        `Humidity: ${data.hourly.relative_humidity_2m[idx]}`;
      document.getElementById("sunrise").innerText =
        `Sunrise: ${data.daily.sunrise[idx].split("T")[1]}`;
      document.getElementById("sunset").innerText =
        `Sunset: ${data.daily.sunset[idx].split("T")[1]}`;

      const times = data.hourly.time;
      const temps = data.hourly.temperature_2m;
      const humidities = data.hourly.relative_humidity_2m;

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
            Humidity: ${humidities[i]}%
          `;
        container.appendChild(card);
      }

      // Optional: Add "Show More" button if there are more data points
      if (times.length > maxHours) {
        const showMoreButton = document.getElementById("showMoreButton");
        showMoreButton.style.display = "none"; // Hide by default

        if (times.length > maxHours) {
          showMoreButton.style.display = "block";
          showMoreButton.onclick = function () {
            for (let i = maxHours; i < times.length; i++) {
              const card = document.createElement("div");
              card.className = "card p-2 mb-2";
              card.style.minWidth = "200px";
              card.style.flex = "0 0 auto";
              card.innerHTML = `
                <strong>${times[i]}</strong><br/>
                Temp: ${temps[i]}°C<br/>
                Humidity: ${humidities[i]}%
              `;
              container.appendChild(card);
            }
            showMoreButton.style.display = "none";
          };
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  });
});

document.addEventListener("DOMContentLoaded", isLoggedIn);
