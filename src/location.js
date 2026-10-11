// import { Country, City, State } from "country-state-city";

// const getCitiesWithCountries = function () {
//   // Get all cities worldwide
//   const allCities = City.getAllCities();

//   const citiesWithCountries = allCities.map((city) => {
//     const country = Country.getCountryByCode(city.countryCode);

//     const state = State.getStateByCodeAndCountry(
//       city.stateCode,
//       city.countryCode,
//     );

//     return {
//       city: city.name,
//       countryCode: city.countryCode,
//       stateCode: city.stateCode,
//       state: state ? state.name : "Unknown",
//       countryName: country ? country.name : "Unknown",
//     };
//   });

//   return citiesWithCountries;
// };

// export const allCitiesWithCountries = getCitiesWithCountries();
