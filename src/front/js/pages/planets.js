import React, { useContext, useEffect } from "react";
import "../../styles/home.css";
import { Context } from "../store/appContext";
import { PlanetCard } from "../component/planetCard";

import "../../styles/starwars.css";

export const Planets = () => {
  const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.loadData();
  }, []);

  return (
    <>
      <h1 className="text-center mt-2">Planets</h1>
      <div className=" d-flex justify-content-center text-center mt-5 ">
        <div className="container d-flex overflow-auto ">
          {store.planets.map((planet) => (
            <PlanetCard
              key={planet.uid}
              img={`https://starwars-visualguide.com/assets/img/planets/${planet.uid}.jpg`}
              name={planet.name}
              terrain={planet.terrain}
              population={planet.population}
              type={"planets"}
              uid={planet.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
};
