import { isValidCity, isValidCountry } from "./helpers.js";

export const ScreenController = function (controller) {
  const searchBtn = document.querySelector("#search-btn");
  const weatherCardContainer = document.querySelector(
    "#weather-card-container",
  );

  const searchForm = document.querySelector("#search-form-container");

  searchBtn.addEventListener("click", function () {
    // searchDialog.showModal();
    renderSearchForm();
  });

  const renderErrorState = function (errorMsg) {
    weatherCardContainer.replaceChildren();
    const errorText = document.createElement("h1");
    errorText.textContent = errorMsg;

    weatherCardContainer.appendChild(errorText);
  };

  const clearSearchForm = function () {
    searchForm.replaceChildren();
  };

  const renderSearchForm = function () {
    const loopArr = [
      ["City", "city"],
      ["Country", "country"],
    ];

    // Create both city and country inputs dynamically
    loopArr.forEach((ele) => {
      const searchInputContainer = document.createElement("div");
      searchInputContainer.classList.add("search-input");

      const searchInputLabel = document.createElement("label");
      searchInputLabel.htmlFor = ele[1];
      searchInputLabel.textContent = ele[0];

      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.name = ele[1];
      searchInput.id = ele[1];

      const searchInputError = document.createElement("div");
      searchInputError.classList.add("error");
      searchInputError.ariaLive = "polite";

      // Live error check for changes in city input
      if (ele[1] === "city") {
        searchInput.addEventListener("input", function (e) {
          e.preventDefault();

          const city = searchInput.value;
          const cityCheck = isValidCity(city);
          if (!cityCheck.isValid) {
            // display error below input
            showInvalid(searchInput, searchInputError, cityCheck.error);
            return;
          }
          showValid(searchInput, searchInputError);
        });
      } else {
        // Live error check for changes in country input
        searchInput.addEventListener("input", function (e) {
          e.preventDefault();

          const country = searchInput.value;
          const countryCheck = isValidCountry(country);
          if (!countryCheck.isValid) {
            // display error below input
            showInvalid(searchInput, searchInputError, countryCheck.error);
            return;
          }
          showValid(searchInput, searchInputError);
        });
      }

      searchInputContainer.appendChild(searchInputLabel);
      searchInputContainer.appendChild(searchInput);
      searchInputContainer.appendChild(searchInputError);
      searchForm.appendChild(searchInputContainer);
    });

    const searchFormBtnsContainer = document.createElement("div");
    searchFormBtnsContainer.classList.add("search-form-btns-container");

    const searchCancelBtn = document.createElement("button");
    searchCancelBtn.classList.add("search-cancel-btn");
    searchCancelBtn.value = "cancel";
    searchCancelBtn.textContent = "Cancel";
    searchCancelBtn.addEventListener("click", function (e) {
      e.preventDefault();

      clearSearchForm();
    });

    const searchConfirmBtn = document.createElement("button");
    searchConfirmBtn.classList.add("search-confirm-btn");
    searchConfirmBtn.value = "confirm";
    searchConfirmBtn.textContent = "Confirm";
    searchConfirmBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const cityInputEle = document.querySelector("#city");
      const cityInputErrorEle = document.querySelector("#city + div.error");

      const countryInputEle = document.querySelector("#country");
      const countryInputErrorEle = document.querySelector(
        "#country + div.error",
      );

      const city = cityInputEle.value;
      const country = countryInputEle.value;

      const cityCheck = isValidCity(city);
      const countryCheck = isValidCountry(country);
      if (!cityCheck.isValid) {
        // display error below input
        showInvalid(cityInputEle, cityInputErrorEle, cityCheck.error);
        return;
      }

      showValid(cityInputEle, cityInputErrorEle);

      if (!countryCheck.isValid) {
        showInvalid(countryInputEle, countryInputErrorEle, countryCheck.error);
        return;
      }

      showValid(countryInputEle, countryInputErrorEle);

      // Both inputs are validated, so create Weather Card

      // Load the data
      try {
        // Render loading State while waiting for the data to load
        renderLoadingState();
        await controller.loadNewCardData({ city, country });
        const newCard = controller.getCard();
        // Render it
        renderWeatherCard(newCard);
        // Reset load status
        controller.resetLoaded();
      } catch (err) {
        console.error("Error caught in search button handler: " + err);
        // An error occurred, so render it
        const errorMsg = controller.getErrorMessage();
        renderErrorState(errorMsg);
      } finally {
        // Clear form
        clearSearchForm();
      }
    });

    searchFormBtnsContainer.appendChild(searchCancelBtn);
    searchFormBtnsContainer.appendChild(searchConfirmBtn);

    searchForm.appendChild(searchFormBtnsContainer);
  };

  const renderLoadingState = function () {
    weatherCardContainer.replaceChildren();
    const loadingText = document.createElement("h1");
    loadingText.textContent = "Loading...";

    weatherCardContainer.appendChild(loadingText);
  };

  const renderWeatherCard = function (card) {
    weatherCardContainer.replaceChildren();

    const locationText = document.createElement("p");
    locationText.textContent = card.location;

    const localTimeText = document.createElement("p");
    localTimeText.textContent = `${card.localTime} · local time`;

    const temperatureText = document.createElement("p");
    temperatureText.textContent = `${card.temp}°`;

    const conditionsText = document.createElement("p");
    conditionsText.textContent = card.conditions;

    const feelsLikeText = document.createElement("p");
    feelsLikeText.textContent = `Feels like ${card.feelsLike}°`;

    const bottomDataContainer = document.createElement("div");
    bottomDataContainer.classList.add("bottom-data-container");

    const humidityDataContainer = document.createElement("div");
    humidityDataContainer.classList.add("humidity-data-container");
    const humidityDataTitle = document.createElement("p");
    humidityDataTitle.textContent = "HUMIDITY";
    const humidityData = document.createElement("p");
    humidityData.textContent = `${card.humidity} %`;
    humidityDataContainer.appendChild(humidityDataTitle);
    humidityDataContainer.appendChild(humidityData);

    const windSpeedDataContainer = document.createElement("div");
    windSpeedDataContainer.classList.add("wind-speed-data-container");
    const windSpeedTitle = document.createElement("p");
    windSpeedTitle.textContent = "WIND";
    const windSpeedData = document.createElement("p");
    windSpeedData.textContent = `${card.windspeed} km/h`;
    windSpeedDataContainer.appendChild(windSpeedTitle);
    windSpeedDataContainer.appendChild(windSpeedData);

    const highLowDataContainer = document.createElement("div");
    highLowDataContainer.classList.add("high-low-data-container");
    const highLowDataTitle = document.createElement("p");
    highLowDataTitle.textContent = "HI / LO";
    const highLowData = document.createElement("p");
    highLowData.textContent = `${card.high}° / ${card.low}°`;
    highLowDataContainer.appendChild(highLowDataTitle);
    highLowDataContainer.appendChild(highLowData);

    bottomDataContainer.appendChild(humidityDataContainer);
    bottomDataContainer.appendChild(windSpeedDataContainer);
    bottomDataContainer.appendChild(highLowDataContainer);

    weatherCardContainer.appendChild(locationText);
    weatherCardContainer.appendChild(localTimeText);
    weatherCardContainer.appendChild(temperatureText);
    weatherCardContainer.appendChild(conditionsText);
    weatherCardContainer.appendChild(feelsLikeText);
    weatherCardContainer.appendChild(bottomDataContainer);
  };

  function showInvalid(input, inputError, error) {
    input.setCustomValidity(error);
    inputError.className = "error active";
    inputError.textContent = error;
  }

  function showValid(input, inputError) {
    input.setCustomValidity("");
    inputError.className = "error";
    inputError.textContent = "";
  }
};
