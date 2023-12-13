// Execute the code when the window has finished loading
window.addEventListener("load", () => {
  let long;
  let lat;

  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {

    //Get the current position using geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // Construct the API URL using latitude and longitude
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0735234e5ecd163762dfa025a9b43679&units=imperial`;

      // Fetch weather data from the API
      fetch(api)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {

          // Extract relevant weather information from the API response
          const name = data.name;
          const icon = data.weather[0].icon;
          const description = data.weather[0].description;
          const temp = data.main.temp;
          const humidity = data.main.humidity;
          const speed = data.wind.speed;
          const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Log the weather data to the console
          console.log(
            name,
            icon,
            description,
            temp,
            humidity,
            speed,
            sunrise,
            sunset
          );

          // Update the UI with the user weather information
          document.querySelector(".userCity").innerText = "Weather in " + name;
          document
            .querySelector(".userIcon")
            .setAttribute(
              "src",
              `http://openweathermap.org/img/wn/${icon}.png`
            );
          document.querySelector(".userDescription").innerText = description;
          document.querySelector(".userTemp").innerText = temp + "°F";
          document.querySelector(".userHumidity").innerText =
            "Humidity: " + humidity + "%";
          document.querySelector(".userWindSpeed").innerText =
            "Wind Speed: " + speed + " MPH";
          document.querySelector(".userSunRise").innerText =
            "Sunrise: " + sunrise;
          document.querySelector(".userSunSet").innerText = "Sunset: " + sunset;
        })
        .catch((error) => {
          console.log("Error fetching weather data:", error);
        });
    });
  }

  // Object to manage weather-related functionality
  let weather = {
    savedCities: [],

    // Function to fetch weather data for a given city
    fetchWeather: function (cityName) {
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0735234e5ecd163762dfa025a9b43679&units=imperial`;
      return fetch(api)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json();
        });
    },

    // Function to display weather information on the UI
    displayWeather: function (data) {

      // Extract relevant weather information from the API response
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

       // Display current weather information
  const cityNameElement = document.querySelector(".cityName");
  const iconElement = document.querySelector(".icon");
  const descriptionElement = document.querySelector(".description");
  const temperatureElement = document.querySelector(".temperature");
  const humidityElement = document.querySelector(".humidity");
  const windSpeedElement = document.querySelector(".windSpeed");
  const sunRiseElement = document.querySelector(".sunRise");
  const sunSetElement = document.querySelector(".sunSet");

  if (cityNameElement && iconElement && descriptionElement && temperatureElement && humidityElement && windSpeedElement && sunRiseElement && sunSetElement) {
    cityNameElement.innerText = "Weather in " + name;
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${icon}.png`);
    descriptionElement.innerText = description;
    temperatureElement.innerText = temp + "°F";
    humidityElement.innerText = "Humidity: " + humidity + "%";
    windSpeedElement.innerText = "Wind Speed: " + speed + " MPH";
    sunRiseElement.innerText = "Sunrise: " + sunrise;
    sunSetElement.innerText = "Sunset: " + sunset;
  }

  // Display saved city information
  this.savedCities.forEach((savedCity, index) => {
    const savedCityElement = document.querySelector(`.searchContainer${index + 1}`);
    if (savedCityElement) {
      savedCityElement.innerHTML = `
        <h2 class="fontSize">${savedCity.name}</h2>
        <div class="tempSize">${savedCity.temp}°F</div>
        <img src="http://openweathermap.org/img/wn/${savedCity.icon}.png" alt="${savedCity.description}" />
        <div class="fontSize">${savedCity.description}</div>
        <div class="fontSize">Humidity: ${savedCity.humidity}%</div>
        <div class="fontSize">Wind Speed: ${savedCity.speed} MPH</div>
        <div class="fontSize">Sunrise: ${savedCity.sunrise}</div>
        <div class="fontSize">Sunset: ${savedCity.sunset}</div>
      `;
    }
  });
},

    // Function to search for weather information of a city
    search: async function () {

      // Get user input for the city name
      const userInput = document.querySelector("#userInput");
      const cityName = userInput.value;

      try {

        // Fetch weather data for the specified city
        const data = await this.fetchWeather(cityName);

        // Save the city information in the array
        this.savedCities.push({
          name: data.name,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          temp: data.main.temp,
          humidity: data.main.humidity,
          speed: data.wind.speed,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        // Display the weather information
        this.displayWeather(data);

        // Determine the search container to update
        const containerIndex = this.savedCities.length;
        const searchContainer = document.querySelector(`.searchContainer${containerIndex}`);
        if (searchContainer) {
          // Update the existing search container
          searchContainer.style.display = "block";
        }

        // Clear the input field after searching
        userInput.value = '';
      } catch (error) {
        console.log("Error fetching weather data:", error);
      }
    },
  };

  // Event listener for the search button
  document.querySelector("button").addEventListener("click", function () {
    weather.search();
  });

  // Event listener for the Enter key in the input field
  userInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      weather.search();
    }
  });
});
