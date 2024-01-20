const container = document.querySelector(".container");
const search = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-box input");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const APIKeys = "d11b9bc2161fe1f21145a63c54090eeb";

function removeSuggestion() {
  const suggestions = document.querySelectorAll(".suggestion");
  if (suggestions) {
    container.style.maxHeight = "105px";
    suggestions.forEach((suggestion) => {
      suggestion.parentNode.removeChild(suggestion);
    });
  }
}

searchInput.addEventListener("input", removeSuggestion);
search.addEventListener("submit", removeSuggestion);

search.addEventListener("submit", (event) => {
  const city = document.querySelector(".search-box input").value;
  event.preventDefault();

  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${APIKeys}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      const reverseList = json.slice().reverse();
      if (json.length > 0) {
        for (let i = 0; i < reverseList.length; i++) {
          const suggestionContainer = `<div class="suggestion" data-lat="${reverseList[i].lat}" data-lon="${reverseList[i].lon}">
                    <span class="city" data-lat="${reverseList[i].lat}" data-lon="${reverseList[i].lon}">${reverseList[i].name}</span>
                    <span class="country" data-lat="${reverseList[i].lat}" data-lon="${reverseList[i].lon}">${reverseList[i].state}</span>
                    <span class="country" data-lat="${reverseList[i].lat}" data-lon="${reverseList[i].lon}">${reverseList[i].country}</span>
                </div>`;
          search.insertAdjacentHTML("afterend", suggestionContainer);
        }
        error404.style.display = "none";
        weatherDetails.style.display = "none";
        weatherBox.style.display = "none";
        container.style.maxHeight = "100%";
        return;
      } else {
        console.log("error");
        container.style.maxHeight = "100%";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }
    });

  container.addEventListener("click", (e) => {
    const cityLon = e.target.getAttribute("data-lon");
    const cityLat = e.target.getAttribute("data-lat");
    if (cityLat && cityLon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=metric&appid=${APIKeys}`)
        .then((response) => response.json())
        .then((json) => {
          if (json.cod == "200") {
            console.log(json);
            removeSuggestion();

            const image = document.querySelector(".weather-box img");
            const temperature = document.querySelector(".weather-box .temperature");
            const description = document.querySelector(".weather-box .description");
            const humidity = document.querySelector(".weather-details .humidity span");
            const wind = document.querySelector(".weather-details .wind span");

            switch (json.weather[0].main) {
              case "Clear":
                image.src = "images/clear.png";
                break;

              case "Rain":
                image.src = "images/rain.png";
                break;

              case "Snow":
                image.src = "images/snow.png";
                break;

              case "Clouds":
                image.src = "images/cloud.png";
                break;

              case "Haze":
                image.src = "images/mist.png";
                break;

              case "Fog":
                image.src = "images/clear.png";
                break;

              case "Snow":
                image.src = "images/clear.png";
                break;

              default:
                image.src = "images/mist.png";
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = "";
            weatherDetails.style.display = "";
            weatherBox.classList.add("fadeIn");
            weatherDetails.classList.add("fadeIn");
            container.style.maxHeight = "min-content";
          } else {
            console.log("error");
            container.style.height = "400px";
            weatherBox.style.display = "none";
            weatherDetails.style.display = "none";
            error404.style.display = "block";
            error404.classList.add("fadeIn");
            return;
          }
        });
    }
  });
});
