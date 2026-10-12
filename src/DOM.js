import { emojiFor, isValidCity, isValidCountry, themeFor } from "./helpers.js";

export const ScreenController = function (controller) {
  const searchBtn = document.querySelector("#search-btn");
  const weatherCardContainer = document.querySelector(
    "#weather-card-container",
  );

  const searchForm = document.querySelector("#search-form-container");
  const tempUnitToggleContainer = document.querySelector(
    ".temp-unit-toggle-container",
  );

  searchBtn.addEventListener("click", function () {
    // searchDialog.showModal();
    renderSearchForm();
  });

  const clearSearchForm = function () {
    searchForm.replaceChildren();
  };

  const renderSearchForm = function () {
    clearSearchForm();
    const loopArr = [
      ["City", "city"],
      ["Country", "country"],
    ];

    // Create both city and country inputs dynamically
    loopArr.forEach((ele) => {
      const searchInputContainer = document.createElement("div");
      searchInputContainer.classList.add("search-input-container");

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
        weatherCardContainer.replaceChildren();
        tempUnitToggleContainer.replaceChildren();
        renderTempUnitToggleBtns();
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

  const renderErrorState = function (errorMsg) {
    weatherCardContainer.replaceChildren();

    const errorWeatherCard = document.createElement("div");
    errorWeatherCard.classList.add("error-weather-card");

    const errorWeatherIcon = document.createElement("p");
    errorWeatherIcon.classList.add("error-weather-icon");
    errorWeatherIcon.textContent = emojiFor("rain");

    const errorWeatherMsg = document.createElement("p");
    errorWeatherMsg.classList.add("error-weather-msg");
    errorWeatherMsg.textContent = errorMsg;

    errorWeatherCard.appendChild(errorWeatherIcon);
    errorWeatherCard.appendChild(errorWeatherMsg);

    weatherCardContainer.appendChild(errorWeatherCard);
  };

  const renderLoadingState = function () {
    weatherCardContainer.replaceChildren();

    const loadingWeatherCard = document.createElement("div");
    loadingWeatherCard.classList.add("loading-weather-card");

    const spinnerContainer = document.createElement("div");
    spinnerContainer.classList.add("spinner-container");

    const spinnerEle = document.createElement("div");
    spinnerEle.classList.add("loading-spinner");

    spinnerContainer.appendChild(spinnerEle);

    const middleBlocksContainer = document.createElement("div");
    middleBlocksContainer.classList.add("middle-blocks-container");

    const middleLongThinRectangle = document.createElement("div");
    middleLongThinRectangle.classList.add("middle-long-thin-rectangle");
    const middleMidRectangle = document.createElement("div");
    middleMidRectangle.classList.add("middle-mid-rectangle");
    const middleSmallRectangle = document.createElement("div");
    middleSmallRectangle.classList.add("middle-small-rectangle");

    middleBlocksContainer.appendChild(middleLongThinRectangle);
    middleBlocksContainer.appendChild(middleMidRectangle);
    middleBlocksContainer.appendChild(middleSmallRectangle);

    const bottomBlocksContainer = document.createElement("div");
    bottomBlocksContainer.classList.add("bottom-blocks-container");

    for (let i = 0; i < 3; i++) {
      const bottomBlock = document.createElement("div");
      bottomBlock.classList.add("bottom-block");
      bottomBlocksContainer.appendChild(bottomBlock);
    }

    loadingWeatherCard.appendChild(spinnerContainer);
    loadingWeatherCard.appendChild(middleBlocksContainer);
    loadingWeatherCard.appendChild(bottomBlocksContainer);

    weatherCardContainer.appendChild(loadingWeatherCard);
  };

  const renderTempUnitToggleBtns = function () {
    // Celsius and Fahrenheit toggle buttons
    const tempUnitCelsiusBtn = document.createElement("button");
    tempUnitCelsiusBtn.classList.add("celsius-btn");
    tempUnitCelsiusBtn.classList.add("active");
    tempUnitCelsiusBtn.textContent = "°C";
    tempUnitCelsiusBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (controller.getCurrentUnit() !== "Celsius") {
        tempUnitCelsiusBtn.classList.add("active");
        tempUnitFahrenheitBtn.classList.remove("active");
        controller.convertToCelsiusUnit();
        const modifiedCard = controller.getCard();
        weatherCardContainer.replaceChildren();
        // renderTempUnitToggleBtns();
        renderWeatherCard(modifiedCard);
      }
    });

    const tempUnitFahrenheitBtn = document.createElement("button");
    tempUnitFahrenheitBtn.classList.add("fahrenheit-btn");
    tempUnitFahrenheitBtn.textContent = "°F";
    tempUnitFahrenheitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (controller.getCurrentUnit() !== "Fahrenheit") {
        tempUnitFahrenheitBtn.classList.add("active");
        tempUnitCelsiusBtn.classList.remove("active");
        controller.convertToFahrenheitUnit();
        const modifiedCard = controller.getCard();
        weatherCardContainer.replaceChildren();
        // renderTempUnitToggleBtns();
        renderWeatherCard(modifiedCard);
      }
    });

    tempUnitToggleContainer.appendChild(tempUnitCelsiusBtn);
    tempUnitToggleContainer.appendChild(tempUnitFahrenheitBtn);
  };

  const renderWeatherCard = function (card) {
    document.body.dataset.condition = themeFor(card.icon);

    // Weather card
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");

    const topTextContainer = document.createElement("div");
    topTextContainer.classList.add("top-text-container");

    const topTextLeftContainer = document.createElement("div");
    topTextLeftContainer.classList.add("top-text-left-container");

    const locationText = document.createElement("p");
    locationText.classList.add("location-txt");
    locationText.textContent = card.location;

    const localTimeText = document.createElement("p");
    localTimeText.classList.add("local-time-txt");
    localTimeText.textContent = `${card.localTime} · local time`;

    const topTextRightContainer = document.createElement("div");
    topTextRightContainer.classList.add("top-text-right-container");

    const topTextIcon = document.createElement("p");
    topTextIcon.classList.add("top-text-icon");
    topTextIcon.textContent = emojiFor(card.icon);
    topTextIcon.ariaLabel = `Current condition is: ${card.icon}`;

    topTextLeftContainer.appendChild(locationText);
    topTextLeftContainer.appendChild(localTimeText);

    topTextRightContainer.appendChild(topTextIcon);

    topTextContainer.appendChild(topTextLeftContainer);
    topTextContainer.appendChild(topTextRightContainer);

    const temperatureText = document.createElement("p");
    temperatureText.classList.add("temp-txt");
    temperatureText.textContent = `${card.temp}°`;

    const conditionsText = document.createElement("p");
    conditionsText.classList.add("conditions-txt");
    conditionsText.textContent = card.conditions;

    const feelsLikeText = document.createElement("p");
    feelsLikeText.classList.add("feels-like-txt");
    feelsLikeText.textContent = `Feels like ${card.feelsLike}°`;

    const bottomDataContainer = document.createElement("div");
    bottomDataContainer.classList.add("bottom-data-container");

    const humidityDataContainer = document.createElement("div");
    humidityDataContainer.classList.add("data-container");
    const humidityDataTitle = document.createElement("p");
    humidityDataTitle.classList.add("data-title");
    humidityDataTitle.textContent = "HUMIDITY";
    const humidityData = document.createElement("p");
    humidityData.classList.add("data-text");
    humidityData.textContent = `${card.humidity} %`;
    humidityDataContainer.appendChild(humidityDataTitle);
    humidityDataContainer.appendChild(humidityData);

    const windSpeedDataContainer = document.createElement("div");
    windSpeedDataContainer.classList.add("data-container");
    const windSpeedTitle = document.createElement("p");
    windSpeedTitle.classList.add("data-title");
    windSpeedTitle.textContent = "WIND";
    const windSpeedData = document.createElement("p");
    windSpeedData.classList.add("data-text");
    windSpeedData.textContent = `${card.windspeed} km/h`;
    windSpeedDataContainer.appendChild(windSpeedTitle);
    windSpeedDataContainer.appendChild(windSpeedData);

    const highLowDataContainer = document.createElement("div");
    highLowDataContainer.classList.add("data-container");
    const highLowDataTitle = document.createElement("p");
    highLowDataTitle.classList.add("data-title");
    highLowDataTitle.textContent = "HI / LO";
    const highLowData = document.createElement("p");
    highLowData.classList.add("data-text");
    highLowData.textContent = `${card.high}° / ${card.low}°`;
    highLowDataContainer.appendChild(highLowDataTitle);
    highLowDataContainer.appendChild(highLowData);

    bottomDataContainer.appendChild(humidityDataContainer);
    bottomDataContainer.appendChild(windSpeedDataContainer);
    bottomDataContainer.appendChild(highLowDataContainer);

    weatherCard.appendChild(topTextContainer);
    weatherCard.appendChild(temperatureText);
    weatherCard.appendChild(conditionsText);
    weatherCard.appendChild(feelsLikeText);
    weatherCard.appendChild(bottomDataContainer);

    weatherCardContainer.appendChild(weatherCard);
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
