const getState = ({ getStore, getActions, setStore }) => ({
  store: {
    characters: [],
    planets: [],
    vehicles: [],
    favoritesCharacters: [],
    favoritesPlanets: [],
    favoritesVehicles: [],
    suggestions: [],
  },
  actions: {
    loadData: () => {
      try {
        getActions().fetchProcedures("characters");
        getActions().fetchProcedures("planets");
        getActions().fetchProcedures("vehicles");
      } catch (error) {
        console.log("Error loading data ", error);
      }
    },

    fetchProcedures: async (typeOfData) => {
      const localStorageKey = `swapi_${typeOfData}`;
      const cachedData = localStorage.getItem(localStorageKey);

      if (cachedData) {
        setStore({
          [typeOfData]: JSON.parse(cachedData),
        });
        return;
      }

      let url = "";
      if (typeOfData === "characters") {
        url = "https://www.swapi.tech/api/people";
      } else {
        url = `https://www.swapi.tech/api/${typeOfData}`;
      }

      try {
        const dataResponse = await fetch(url);
        if (!dataResponse.ok) {
          throw Error(dataResponse.status);
        }
        const data = await dataResponse.json();

        const dataDetails = data.results.map(async (item) => {
          try {
            const dataResponseP = await fetch(item.url);
            if (!dataResponseP.ok) {
              throw Error(dataResponseP);
            }
            const individualData = await dataResponseP.json();
            return {
              ...individualData.result.properties,
              description: individualData.result.description,
              id: individualData.result._id,
              uid: individualData.result.uid,
            };
          } catch (error) {
            console.log("Error in details: ", error);
          }
        });

        const dataWithDetail = await Promise.all(dataDetails);
        console.log(dataWithDetail);

        setStore({
          [typeOfData]: dataWithDetail,
        });

        localStorage.setItem(localStorageKey, JSON.stringify(dataWithDetail));
      } catch (error) {
        console.log("Error in type of data ", error);
      }
    },

    loadSingleView: (id, setDetails, typeOfData, dataSet) => {
      const item = getStore()[typeOfData + "s"].find((item) => item.uid === id);
      console.log(item);
      const details = {};
      for (const [key, value] of Object.entries(dataSet)) {
        details[key] = item[value];
      }
      setDetails(details);
    },

    addFavoriteItem: (id, typeOfData) => {
      const item = getStore()[typeOfData.toLowerCase()].find(
        (item) => item.uid === id
      );
      const favoriteKey = "favorites" + typeOfData;
      localStorage.setItem(
        favoriteKey,
        JSON.stringify(getStore()[favoriteKey].concat(item))
      );
      setStore({
        [favoriteKey]: getStore()[favoriteKey].concat(item),
      });
    },
    removeFavoriteItem: (id, typeOfData) => {
      const favoriteKey = "favorites" + typeOfData;
      const newListFavorite = getStore()[favoriteKey].filter((item) => {
        return item.uid != id;
      });
      localStorage.setItem(favoriteKey, JSON.stringify(newListFavorite));
      setStore({ [favoriteKey]: newListFavorite });
    },

    checkIsFavoriteItem: (id, typeOfData) => {
      const favoriteKey = "favorites" + typeOfData;
      if (getStore()[favoriteKey].some((fav) => fav.uid == id)) {
        return true;
      } else {
        return false;
      }
    },

    fetchFavoriteLocalStorage: () => {
      setStore({
        favoritesCharacters:
          JSON.parse(localStorage.getItem("favoritesCharacters")) || [],
        favoritesPlanets:
          JSON.parse(localStorage.getItem("favoritesPlanets")) || [],
        favoritesVehicles:
          JSON.parse(localStorage.getItem("favoritesVehicles")) || [],
      });
    },

    autocomplete: (query) => {
      const store = getStore();
      if (query.length > 0) {
        const filteredCharacters = store.characters.filter((character) =>
          character.name.toLowerCase().includes(query.toLowerCase())
        );
        const filteredPlanets = store.planets.filter((planet) =>
          planet.name.toLowerCase().includes(query.toLowerCase())
        );
        const filteredVehicles = store.vehicles.filter((vehicle) =>
          vehicle.name.toLowerCase().includes(query.toLowerCase())
        );

        setStore({
          suggestions: [
            ...filteredCharacters.map((item) => ({
              ...item,
              type: "characters",
            })),
            ...filteredPlanets.map((item) => ({ ...item, type: "planets" })),
            ...filteredVehicles.map((item) => ({ ...item, type: "vehicles" })),
          ],
        });
      } else {
        setStore({ suggestions: [] });
      }
    },
  },
});

export default getState;
