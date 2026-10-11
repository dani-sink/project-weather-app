import { requestLocationData } from "./api/visual_crossing_api.js";
import { createCard } from "./card.js";
import { celsiusToFahrenheit, parseAndFormatTime } from "./helpers.js";

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

      //   Convert to Fahrenheit if needed
      if (tempUnit === "Fahrenheit") {
        temp = celsiusToFahrenheit(temp);
        feelsLike = celsiusToFahrenheit(feelsLike);
        high = celsiusToFahrenheit(high);
        low = celsiusToFahrenheit(low);
      }

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
    } catch (err) {
      console.error("Error caught in loadNewCardData(): " + err);
      loaded = false;
      errorMessage = err.message;
      throw err;
    }
  };

  const getCard = function () {
    return card;
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
  };
};
