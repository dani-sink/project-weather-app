export const createCard = function (
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
  return {
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
  };
};
