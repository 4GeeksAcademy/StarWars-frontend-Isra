import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const SingleCharacter = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [characterDetails, setCharacterDetail] = useState({
    name: "",
    description: "",
    gender: "",
    birthYear: "",
    skinColor: "",
    height: "",
    eyeColor: "",
  });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (store.characters.length > 0) {
      actions.loadSingleView(id, setCharacterDetail, "character", {
        name: "name",
        description: "description",
        gender: "gender",
        birthYear: "birth_year",
        skinColor: "skin_color",
        height: "height",
        eyeColor: "eye_color",
        uid: "uid",
      });
      setIsFavorite(actions.checkIsFavoriteItem(id, "Characters"));
    } else {
      actions.loadData();
    }
  }, [id, store.characters, store.favoritesCharacters]);

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div
        className="card mb-3 bg-transparent border-warning"
        style={{ maxWidth: "1200px" }}
      >
        <div className="row g-0 flex-nowrap">
          <div className="col-md-4 m-4 mt-5">
            <img
              src={`https://starwars-visualguide.com/assets/img/characters/${characterDetails.uid}.jpg`}
              className="img-fluid rounded-start"
              alt={characterDetails.name}
            />
          </div>
          <div className="card-body mt-3">
            <div className="d-flex justify-content-center flex-column">
              <h2 className="card-title text-warning">
                {characterDetails.name}
              </h2>
              <p className="card-text me-2 text-white">
                {characterDetails.description}
              </p>
              <div className="d-flex flex-row card-text">
                <div className="m-2 ms-0">
                  <small className="text-danger">Birth Year</small>
                  <p className="text-white">{characterDetails.birthYear}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Gender</small>
                  <p className="text-white">{characterDetails.gender}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Height</small>
                  <p className="text-white">{characterDetails.height}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Skin Color</small>
                  <p className="text-white">{characterDetails.skinColor}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Eye Color</small>
                  <p className="text-white">{characterDetails.eyeColor}</p>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-outline-danger mx-2"
                  onClick={() => {
                    if (isFavorite) {
                      actions.removeFavoriteItem(id, "Characters");
                      console.log(store.favoritesCharacters);
                    } else {
                      actions.addFavoriteItem(id, "Characters");
                      console.log(store.favoritesCharacters);
                    }
                  }}
                >
                  <i
                    className={
                      isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
                    }
                  ></i>{" "}
                  Add to Favorite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
