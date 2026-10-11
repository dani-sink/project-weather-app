import { requestLocationData } from "./api/visual_crossing_api.js";
import { createCard } from "./card.js";
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  parseAndFormatTime,
} from "./helpers.js";

export const ApiDataController = function () {
  let card = null;
  let tempUnit = "Celsius";
  let loaded = false;
  let errorMessage = "";

  const loadNewCardData = async function (loc) {
    try {
      const locationData = await requestLocationData(loc);
      const location = locationData.resolvedAddress;
      const conditions = locationData.currentConditions.conditions;
      const icon = locationData.currentConditions.icon;
      const humidity = locationData.currentConditions.humidity;
      const windspeed = locationData.currentConditions.windspeed;
      const localTime = parseAndFormatTime(
        locationData.currentConditions.datetime,
      );

      //   Temperature attributes
      let temp = locationData.currentConditions.temp;
      let feelsLike = locationData.currentConditions.feelslike;
      let high = locationData.days[0].tempmax;
      let low = locationData.days[0].tempmin;

      createNewCard(
        location,
        temp,
        feelsLike,
        conditions,
        icon,
        humidity,
        windspeed,
        high,
        low,
        localTime,
      );
    } catch (err) {
      console.error("Error caught in loadNewCardData(): " + err);
      loaded = false;
      errorMessage = err.message;
      throw err;
    }
  };

  const createNewCard = function (
    location,
    temp,
    feelsLike,
    conditions,
    icon,
    humidity,
    windspeed,
    high,
    low,
    localTime,
  ) {
    //   Round to nearest integer
    temp = Math.round(temp);
    feelsLike = Math.round(feelsLike);
    high = Math.round(high);
    low = Math.round(low);

    // Create Card Object
    card = createCard(
      location,
      temp,
      feelsLike,
      conditions,
      icon,
      humidity,
      windspeed,
      high,
      low,
      localTime,
    );
    loaded = true;
    errorMessage = "";
  };

  const toggleFahrenheitUnit = function () {
    tempUnit = "Fahrenheit";
  };

  const convertTempsToFahrenheit = function () {
    card.temp = Math.round(celsiusToFahrenheit(card.temp));
    card.feelsLike = Math.round(celsiusToFahrenheit(card.feelsLike));
    card.high = Math.round(celsiusToFahrenheit(card.high));
    card.low = Math.round(celsiusToFahrenheit(card.low));
  };

  const convertToFahrenheitUnit = function () {
    toggleFahrenheitUnit();
    convertTempsToFahrenheit();
  };

  const toggleCelsiusUnit = function () {
    tempUnit = "Celsius";
  };

  const convertTempsToCelsius = function () {
    card.temp = Math.round(fahrenheitToCelsius(card.temp));
    card.feelsLike = Math.round(fahrenheitToCelsius(card.feelsLike));
    card.high = Math.round(fahrenheitToCelsius(card.high));
    card.low = Math.round(fahrenheitToCelsius(card.low));
  };

  const convertToCelsiusUnit = function () {
    toggleCelsiusUnit();
    convertTempsToCelsius();
  };

  const getCard = function () {
    return card;
  };

  const getCurrentUnit = function () {
    return tempUnit;
  };

  const isLoaded = function () {
    return loaded;
  };

  const resetLoaded = function () {
    loaded = false;
  };

  const getErrorMessage = function () {
    return errorMessage;
  };

  return {
    loadNewCardData,
    getCard,
    isLoaded,
    resetLoaded,
    getErrorMessage,
    getCurrentUnit,
    convertToCelsiusUnit,
    convertToFahrenheitUnit,
  };
};
