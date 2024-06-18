import React, { useContext, useEffect } from "react";
import "../../styles/home.css";
import { Context } from "../store/appContext";
import { CharacterCard } from "../component/characterCard";
import { CarouselItems } from "../component/CarrouselItems";
import "../../styles/starwars.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.loadData();
  }, []);

  return (
    <div className=" d-flex justify-content-center text-center mt-5 ">
      <ul>
        {store.characters.map((character) => (
          <li>{character.name}</li>
        ))}
      </ul>
      <ul>
        {store.planets.map((planet) => (
          <li>{planet.name}</li>
        ))}
      </ul>
      <ul>
        {store.vehicles.map((vehicle) => (
          <li>{vehicle.name}</li>
        ))}
      </ul>
      {/* {store.characters.map((character) => (
        <CharacterCard
          img={`https://starwars-visualguide.com/assets/img/characters/${character.uid}.jpg`}
          name={character.name}
        />
      ))} */}
      {/* <CarouselItems characters={store.characters} /> */}
    </div>
  );
};
