const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner form input");
const msgSpan = document.querySelector(".top-banner .msg");
const list = document.querySelector(".cities");

// localStorage.setItem apikey done.
localStorage.setItem(
  "apikey",
  EncryptStringAES("4d8fb5b93d4af21d66a2948710284366")
);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeatherDataFromApi();
  form.reset();
});

const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apikey"));
  const cityName = input.value;
  const units = "metric";
  const lang = "en";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url).then((response) => response.json());
    console.log(response);

    const { main, name, weather, sys } = response;

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
    console.log(iconUrlAWS);

    const cityNameSpans = list.querySelectorAll("span");
    // list.querySelectorAll => NodeList
    // document.getElementsByClassName => Html Collection
    if (cityNameSpans.length > 0) {
      // matching span text with input value?
      const filteredArray = [...cityNameSpans].filter(
        (span) => span.textContent == name
      );
      if (filteredArray.length > 0) {
        msgSpan.textContent = `You already know the weather for ${name}. Please search for another city 😉`;
        setInterval(() => {
          msgSpan.textContent = "";
        }, 4000);
        return;
      }
    }

    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `
            <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">
                ${Math.round(main.temp)}
                <sup>°C</sup>
            </div>
            <figure>
                <img class="city-icon" src="${iconUrlAWS}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>
        `;
    list.prepend(createdLi);
  } catch (error) {
    msgSpan.textContent = "City not found.";
    setInterval(() => {
      msgSpan.textContent = "";
    }, 3000);
  }
};
