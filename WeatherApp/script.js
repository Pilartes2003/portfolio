const apiKey = "2ebe5b0b804b46988e6451aa715a161f";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const condition = document.getElementById("condition");
const savedTemp = document.getElementById("savedTemp");
const savedCity = document.getElementById("savedCity");
const loading = document.getElementById("loading");
const forecastList = document.getElementById("forecastList");
const portoIcon = document.getElementById("portoIcon");
const luandaIcon = document.getElementById("luandaIcon");
const localTime = document.getElementById("localTime");
const locationBtn = document.getElementById("locationBtn");
const weatherParticles = document.getElementById("weatherParticles");

function getIcon(main, iconCode) {

  const isNight =
  iconCode && iconCode.includes("n");

  if (main === "Clear") {
    return isNight ? "🌙" : "☀️";
  }

  const icons = {
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️"
  };

  return icons[main] || "🌍";
}

function updateBackground(main) {

  document.body.classList.remove(
    "sunny",
    "rainy",
    "cloudy",
    "snowy",
    "stormy"
  );

  if (main === "Clear") {
    document.body.classList.add("sunny");
  }

  else if (
    main === "Rain" ||
    main === "Drizzle"
  ) {
    document.body.classList.add("rainy");
  }

  else if (
    main === "Clouds"
  ) {
    document.body.classList.add("cloudy");
  }

  else if (
    main === "Snow"
  ) {
    document.body.classList.add("snowy");
  }

  else if (
    main === "Thunderstorm"
  ) {
    document.body.classList.add("stormy");
  }

}

function updateParticles(main) {
  weatherParticles.innerHTML = "";

  let type = "star";
  let amount = 35;

  if (main === "Rain" || main === "Drizzle" || main === "Thunderstorm") {
    type = "rain";
    amount = 55;
  } else if (main === "Snow") {
    type = "snow";
    amount = 45;
  } else {
    type = "star";
    amount = 35;
  }

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");

    particle.classList.add("particle", type);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
    particle.style.animationDelay = `${Math.random() * 4}s`;

    weatherParticles.appendChild(particle);
  }
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function updateObservatories() {
  const cities = [
    { name: "Porto", element: portoIcon },
    { name: "Luanda", element: luandaIcon }
  ];

  for (const city of cities) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric&lang=pt`;
      const response = await fetch(url);
      const data = await response.json();

      const icon = getIcon(data.weather[0].main);
      const temp = Math.round(data.main.temp);

      city.element.textContent = `${icon} ${temp}°`;
    } catch (error) {
      city.element.textContent = "--";
    }
  }
}

async function getWeather(city) {
  if (!apiKey || apiKey === "COLOCA_A_TUA_API_KEY_AQUI") {
    message.textContent = "Primeiro coloca a tua API key no ficheiro script.js.";
    return;
  }

  loading.classList.remove("hidden");
  message.textContent = "";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Cidade não encontrada");
    }

    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = capitalize(data.weather[0].description);
    const main = data.weather[0].main;
    const timezone = data.timezone;
    const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (timezone * 1000));
    cityName.textContent = data.name;
    localTime.textContent = localDate.toLocaleTimeString("pt-PT", {
     hour: "2-digit",
      minute: "2-digit"
    });
    if (savedCity) { savedCity.textContent = data.name;}
    weatherDescription.textContent = `${desc} • Atualizado agora`;
    localStorage.setItem("lastCity", data.name);

    const iconCode = data.weather[0].icon;
    weatherIcon.textContent = getIcon(main, iconCode);

    updateBackground(main);
    updateParticles(main);
    temperature.textContent = `${temp}°`;
    feelsLike.textContent = `${feels}°`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    condition.textContent = desc;
    savedTemp.textContent = `${temp}°`;
    getForecast(city);
  } 
  catch (error) {
    message.textContent = "Não encontrei essa cidade. Confirma o nome e tenta novamente.";
  } finally {
    loading.classList.add("hidden");
  }
}


async function getForecast(city) {

  try{

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt`;

    const response = await fetch(url);

    if (!response.ok) {
  throw new Error("Forecast não encontrado");
  }

    const data = await response.json();

    forecastList.innerHTML = "";

    const dailyForecast =
    data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    dailyForecast.slice(0, 5).forEach(day => 
    {

      const date =
      new Date(day.dt_txt);

      const dayName =
      date.toLocaleDateString("pt-PT", {
        weekday: "short"
      });

      const temp =
      Math.round(day.main.temp);

      const icon =
      getIcon(day.weather[0].main);

      forecastList.innerHTML += `
        <div class="forecast-row">
          <span>${dayName}</span>
          <span>${icon} ${temp}°</span>
        </div>
      `;

      }
    );
  } 
  
  catch (error) 
  {
    console.log(error);

  }

  
}

async function getWeatherByCoords(lat, lon){
  loading.classList.remove("hidden");
  message.textContent = "";

  try{
     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Localização não encontrada");
    }

    const data = await response.json();

    cityInput.value = data.name;
    getWeather(data.name);

  }
  catch (error) {
    message.textContent = "Não consegui buscar o clima pela tua localização.";
  } finally {
    loading.classList.add("hidden");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    message.textContent = "O teu navegador não suporta geolocalização.";
    return;
  }

  message.textContent = "A pedir permissão de localização...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeatherByCoords(lat, lon);
    },
    () => {
      message.textContent = "Permissão negada ou localização indisponível.";
    }
  );
});

document.querySelectorAll(".city-card").forEach((button) => {
  button.addEventListener("click", () => {
    const city = button.dataset.city;
    cityInput.value = city;
    getWeather(city);
  });
});

const lastCity = localStorage.getItem("lastCity");

if (lastCity) {
  cityInput.value = lastCity;
  getWeather(lastCity);
} else {
  getWeather("Lisboa");
}

updateObservatories();
