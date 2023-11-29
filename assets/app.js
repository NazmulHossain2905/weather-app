const temperature = document.querySelector(".temperature");
const city = document.querySelector(".city");
const time = document.querySelector(".time");
const weatherIcon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".weather-condition");
const locationSearchInput = document.querySelector(".location-search");
const pressureEl = document.querySelector(".pressure");
const humidityEl = document.querySelector(".humidity");
const windSpeedEl = document.querySelector(".wind-speed");
const visibilityEl = document.querySelector(".visibility");
const locationList = document.querySelector(".location-list");

// Utilities Functions
const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const RECENTLY_SEARCH = getData("recently-search") || [];

locationSearchInput.addEventListener("keypress", async function (e) {
  if (e.key === "Enter") {
    const cityName = e.target.value.trim();
    if (cityName) {
      getWeatherRequest(cityName);
      locationSearchInput.value = "";
    }
  }
});

const displayRecentlySearched = () => {
  const recentSearch = RECENTLY_SEARCH.map((item) => {
    return `<li class="location-item">${item?.toLowerCase()}</li>`;
  });

  locationList.innerHTML = recentSearch.join(" ");
};

const recentlySearched = (cityName) => {
  const length = RECENTLY_SEARCH.length;

  if (!RECENTLY_SEARCH.includes(cityName)) {
    if (length >= 5) {
      RECENTLY_SEARCH.pop();
      RECENTLY_SEARCH.unshift(cityName);
    } else {
      RECENTLY_SEARCH.unshift(cityName);
    }
  } else {
    const index = RECENTLY_SEARCH.indexOf(cityName);
    RECENTLY_SEARCH.splice(index, 1);
    RECENTLY_SEARCH.unshift(cityName);
  }

  saveData("recently-search", RECENTLY_SEARCH);

  displayRecentlySearched();
};

locationList.addEventListener("click", function (e) {
  if (e.target.matches(".location-item")) {
    const cityName = e.target.innerText.toLowerCase();

    locationSearchInput.value = cityName;
    getWeatherRequest(cityName);
  }
});

const displayWeatherData = (weatherData) => {
  const {
    name,
    weather,
    visibility,
    sys: { country },
    main: { temp, humidity, pressure },
    wind: { speed: windSpeed },
  } = weatherData;

  const { icon, main } = weather[0];

  const imageUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  city.innerText = `${name}, ${country}`;
  temperature.innerHTML =
    Math.round(temp) +
    "<sup style='font-weight:500; font-size: 5rem'>&deg;c</sup>";
  weatherCondition.textContent = main;
  weatherIcon.src = imageUrl;

  humidityEl.textContent = humidity + "%";
  windSpeedEl.textContent = windSpeed + "km/h";
  pressureEl.textContent = pressure;
  visibilityEl.textContent = Math.round(visibility / 1000).toFixed(1) + "km";
};

const getWeatherRequest = async (cityName) => {
  try {
    const API_KEY = "f90f5836325e7f4d780c377332d00c71";
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;

    const response = await fetch(`${BASE_URL}&q=${cityName}`);

    switch (response.status) {
      case 404: {
        alert(
          `The "${cityName}" City is not found. \nPlease enter a valid City name.`
        );
        break;
      }
    }

    const jsonData = await await response.json();
    if (jsonData.cod !== "404") {
      displayWeatherData(jsonData);
      recentlySearched(cityName?.toLowerCase());
    }
  } catch (error) {
    console.log(error.message);
  }
};

getWeatherRequest("jessore");

const currentTimeAndDate = () => {
  const date = new Date();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  let amOrPm = hours > 12 ? "PM" : "AM";

  const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];

  const currDate = date.getDate();
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][date.getMonth()];
  const year = date.getFullYear();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${amOrPm} - ${day}, ${currDate} ${month} ${year}`;
};

let times = setInterval(() => {
  time.textContent = currentTimeAndDate();
}, 5000);
time.textContent = currentTimeAndDate();
