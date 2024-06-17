const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      characters: [],
      planets: [],
      vehicles: [],
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

      fetchProcedures: async (typeofData) => {
        let url = "";
        if (typeofData === "characters") {
          url = "https://www.swapi.tech/api/people";
        } else {
          url = `https://www.swapi.tech/api/${typeofData}`;
        }
        try {
          const dataResponse = await fetch(url);
          if (!dataResponse.ok) {
            throw Error(dataResponse.status);
          }
          const data = await dataResponse.json();
          //Data details

          const dataDatails = data.results.map(async (data) => {
            try {
              const dataResponseP = await fetch(data.url);
              if (!dataResponseP.ok) {
                throw Error(dataResponseP);
              }
              const individualData = await dataResponseP.json();
              return {
                ...individualData.result.properties,
                descripiton: individualData.result.descripiton,
                id: individualData.result._id,
                uid: individualData.result.uid,
              };
            } catch (error) {
              console.log("Error in details: ", error);
            }
          });

          const dataWithDetail = await Promise.all(dataDatails);
          console.log(dataWithDetail);

          setStore({
            [typeofData]: dataWithDetail,
          });
        } catch (error) {
          console.log("Error in type of data ", error);
        }
      },

      // getCharacterfromAPI: async () => {
      //   try {
      //     const respuesta = await fetch("https://swapi.tech/api/people");
      //     const dataCharacters = await respuesta.json();
      //     const charactersAPI = dataCharacters.results;

      //     setStore({ characters: charactersAPI });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
      // getPlanetsfromAPI: async () => {
      //   try {
      //     const respuesta = await fetch("https://swapi.tech/api/planets");
      //     const dataPlanet = await respuesta.json();
      //     const PlanetsAPI = dataPlanet.results;

      //     setStore({ planets: PlanetsAPI });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    },
  };
};

export default getState;
