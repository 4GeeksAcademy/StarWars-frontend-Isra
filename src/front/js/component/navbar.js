import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/SWLogo.png";
import { Context } from "../store/appContext";
import { FaMasksTheater } from "react-icons/fa6";
import { GiRingedPlanet } from "react-icons/gi";
import { FaPlaceOfWorship } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import "../../styles/starwars.css";
import { SearchBar } from "./searchBar";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const favoritesNum =
    store.favoritesCharacters.length +
    store.favoritesPlanets.length +
    store.favoritesVehicles.length;

  return (
    <nav
      className="navbar navbar-dark"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand mb-0 h1">
            <img style={{ width: "5em" }} src={logo} alt="Logo" />
          </Link>
          <Link
            to="/"
            className="text-white mx-2 fs-5"
            style={{ textDecoration: "none" }}
          >
            Characters
          </Link>
          <Link
            to="/planets"
            className="text-white mx-2 fs-5"
            style={{ textDecoration: "none" }}
          >
            Planets
          </Link>

          <Link
            to="/vehicles"
            className="text-white mx-2 fs-5"
            style={{ textDecoration: "none" }}
          >
            Vehicles
          </Link>
          <SearchBar />
        </div>

        <div className="btn-group">
          <button
            type="button"
            className="btn btn-danger dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Favorites {""}
            <span className="badge starwars-bg-color text-white">
              {favoritesNum}
            </span>
          </button>
          <ul
            className="dropdown-menu text-white"
            style={{ backgroundColor: "transparent" }}
          >
            <ul className="list-group border-0">
              <p className="m-1 p-1 fs-6 starwars-text-active">Characters</p>
              <li className="list-group-item p-0 rounded-0">
                {store.favoritesCharacters.length == 0 ? (
                  <p className="dropdown-item m-0 ">Add characters</p>
                ) : (
                  store.favoritesCharacters.map((character, index) => (
                    <div
                      className="d-flex flex-row align-items-center"
                      style={{ backgroundColor: "transparent" }}
                      key={index}
                    >
                      <Link
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                        to={`characters/${character.uid}`}
                        className="dropdown-item "
                      >
                        <FaMasksTheater /> {character.name}
                      </Link>
                      <FaTrashAlt
                        className="mx-2"
                        onClick={() =>
                          actions.removeFavoriteItem(
                            character.uid,
                            "Characters"
                          )
                        }
                      />
                    </div>
                  ))
                )}
              </li>
            </ul>
            <ul className="list-group border-0 ">
              <p className="m-1 p-1 fs-6 starwars-text-active">Planets</p>
              <li className="list-group-item p-0 rounded-0">
                {store.favoritesPlanets.length == 0 ? (
                  <p className="dropdown-item m-0 ">Add planets</p>
                ) : (
                  store.favoritesPlanets.map((planet, index) => (
                    <div
                      className="d-flex flex-row align-items-center"
                      key={index}
                    >
                      <Link
                        to={`planets/${planet.uid}`}
                        className="dropdown-item"
                      >
                        <GiRingedPlanet /> {planet.name}
                      </Link>
                      <FaTrashAlt
                        className="mx-2"
                        onClick={() =>
                          actions.removeFavoriteItem(planet.uid, "Planets")
                        }
                      />
                    </div>
                  ))
                )}
              </li>
            </ul>
            <ul className="list-group border-0">
              <p className="m-1 p-1 fs-6 starwars-text-active">Vehicles</p>
              <li className="list-group-item p-0 rounded-0">
                {store.favoritesVehicles.length == 0 ? (
                  <p className="dropdown-item m-0 ">Add vehicles</p>
                ) : (
                  store.favoritesVehicles.map((vehicle, index) => (
                    <div
                      className="d-flex flex-row align-items-center"
                      key={index}
                    >
                      <Link
                        to={`vehicles/${vehicle.uid}`}
                        className="dropdown-item"
                      >
                        <FaPlaceOfWorship /> {vehicle.name}
                      </Link>
                      <FaTrashAlt
                        className="mx-2"
                        onClick={() =>
                          actions.removeFavoriteItem(vehicle.uid, "Vehicles")
                        }
                      />
                    </div>
                  ))
                )}
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </nav>
  );
};
