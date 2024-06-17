import React from "react";

import { CharacterCard } from "./characterCard";

export const CarouselItems = ({ characters }) => {
  return (
    <div
      id="characterCarousel"
      className="carousel slide"
      data-bs-interval="false"
    >
      <div className="carousel-inner">
        {characters.map((character, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={character.uid}
          >
            <CharacterCard
              img={`https://starwars-visualguide.com/assets/img/characters/${character.uid}.jpg`}
              name={character.name}
              id={character.uid}
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#characterCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#characterCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
