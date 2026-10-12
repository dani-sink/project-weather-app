const API_KEY = "83CUQUPLVR3PYT54XBQ6M8UD7";
const BASE =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const buildWeatherUrl = function ({ city, country }) {
  const location = `${city},${country}`;

  // Builds key=...&unitGroup=metric&include=current&contentType=json
  const params = new URLSearchParams({
    key: API_KEY,
    unitGroup: "metric",
    include: "current",
    contentType: "json",
  });

  // encodeURIComponent(location) encodes location to the correct format for Visual Crossing API:
  // Ex: It turns "New York City,US into "New%20York%20City%2CUS"
  const url = `${BASE}/${encodeURIComponent(location)}?${params}`;
  return url;
};

export async function requestLocationData({ city, country }) {
  const url = buildWeatherUrl({ city, country });
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Couldn't find that location. Check the spelling.");
      }
      if (response.status === 401) {
        throw new Error("There was a problem with your API key.");
      }
      if (response.status === 429) {
        throw new Error("Too many requests — try again later");
      }
      throw new Error("Something went wrong. Please try again.");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error caught in requestLocationData(): " + err);
    throw err;
  }
}
