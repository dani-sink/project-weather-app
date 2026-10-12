import { format, parse } from "date-fns";

const WEATHER_EMOJI = {
  // ☀️ Clear & Cloudy
  "clear-day": "☀️",
  "clear-night": "🌙",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "☁️",
  cloudy: "☁️",

  // 🌧️ Rain & Showers
  rain: "🌧️",
  "showers-day": "🌦️",
  "showers-night": "🌧️",

  // ❄️ Snow & Winter Precipitation
  snow: "❄️",
  "snow-showers-day": "🌨️",
  "snow-showers-night": "🌨️",
  sleet: "🌨️",
  hail: "🌨️",
  "rain-snow-showers-day": "🌨️",
  "rain-snow-showers-night": "🌨️",
  "rain-snow": "🌨️",

  // ⛈️ Thunderstorms
  thunder: "🌩️",
  "thunder-rain": "⛈️",
  "thunder-showers-day": "⛈️",
  "thunder-showers-night": "⛈️",

  // 🌫️ Atmospheric
  fog: "🌫️",
  wind: "💨",
};

export const celsiusToFahrenheit = function (celsius) {
  return (celsius * 9) / 5 + 32;
};

export const fahrenheitToCelsius = function (fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
};

export const isValidCity = function (city) {
  // Check for empty input
  if (!city || city.trim() === "") {
    return {
      isValid: false,
      error: "City name cannot be empty.",
    };
  }

  const trimmedCity = city.trim();

  // Check for minimum length
  if (trimmedCity.length < 2) {
    return {
      isValid: false,
      error: "City name must be at least 2 characters.",
    };
  }

  // Regex checks if the structure matches letters, spaces, hyphens, periods, and apostrophes.
  const cityRegex = /^[a-zA-ZÀ-ÿ]+(?:(?:['\-.]?\s?|['\-.]+)[a-zA-ZÀ-ÿ]+)*$/;

  // Check for invalid characters
  if (!cityRegex.test(trimmedCity)) {
    return {
      isValid: false,
      error:
        "Please enter a valid city name (letters, spaces, hyphens, periods, and apostrophes only).",
    };
  }

  return {
    isValid: true,
    error: "",
  };
};

export const isValidCountry = function (country) {
  // Check for empty input
  if (!country || country.trim() === "") {
    return {
      isValid: false,
      error: "Country name cannot be empty.",
    };
  }

  const trimmedCountry = country.trim();

  // Check for minimum length
  if (trimmedCountry.length < 2) {
    return {
      isValid: false,
      error: "Country name must be at least 2 characters.",
    };
  }

  // Allows letters, spaces, hyphens, periods, apostrophes, and parentheses
  const countryRegex =
    /^[a-zA-ZÀ-ÿ]+(?:(?:['\-.]?\s?|['\-.\s])[a-zA-ZÀ-ÿ]+)*(?:\s\([a-zA-ZÀ-ÿ]+(?:(?:['\-.]?\s?|['\-.\s])[a-zA-ZÀ-ÿ]+)*\))?$/;

  // Check for invalid characters
  if (!countryRegex.test(trimmedCountry)) {
    return {
      isValid: false,
      error:
        "Please enter a valid country name (letters, spaces, hyphens, periods, parentheses and apostrophes only).",
    };
  }

  // Input is valid
  return {
    isValid: true,
    error: "",
  };
};

export const parseAndFormatTime = function (timeString) {
  // Parse the time string into a Date object using "HH:mm:ss" format
  const parsedDate = parse(timeString, "HH:mm:ss", new Date());

  // Format the date object into 12-hour format with AM/PM ('hh:mm a')
  const formattedTime = format(parsedDate, "EEEE hh:mm a");
  return formattedTime;
};

export const emojiFor = function (icon) {
  return WEATHER_EMOJI[icon] ?? "🌡️";
};
