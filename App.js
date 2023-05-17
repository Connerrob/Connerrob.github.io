window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0735234e5ecd163762dfa025a9b43679&units=imperial`;

      fetch(api)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          const name = data.name;
          const icon = data.weather[0].icon;
          const description = data.weather[0].description;
          const temp = data.main.temp;
          const humidity = data.main.humidity;
          const speed = data.wind.speed;
          const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );
          const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );

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
  let weather = {
    fetchWeather: function (cityName) {
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0735234e5ecd163762dfa025a9b43679&units=imperial`;
      fetch(api)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
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
      console.log(name, icon, description, temp, humidity, speed);

      document.querySelector(".cityName").innerText = "Weather in " + name;
      document
        .querySelector(".icon")
        .setAttribute("src", `http://openweathermap.org/img/wn/${icon}.png`);
      document.querySelector(".description").innerText = description;
      document.querySelector(".temperature").innerText = temp + "°F";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".windSpeed").innerText =
        "Wind Speed: " + speed + " MPH";
      document.querySelector(".sunRise").innerText = "Sunrise: " + sunrise;
      document.querySelector(".sunSet").innerText = "Sunset: " + sunset;
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1000/?" + name + "')";
    },
    search: function () {
      this.fetchWeather(document.querySelector("#userInput").value);
    },
  };
  document.querySelector("button").addEventListener("click", function () {
    weather.search();
  });
  userInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      weather.search();
    }
  });
});
