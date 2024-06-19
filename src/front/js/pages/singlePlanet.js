import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import Tatooine from "../../img/Tatooine_TPM.webp";

export const SinglePlanet = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [planetDetails, setPlanetDetail] = useState({
    name: "",
    description: "",
    diameter: "",
    rotationPeriod: "",
    orbitalPeriod: "",
    population: "",
    climate: "",
    terrain: "",
    surfaceWater: "",
  });

  useEffect(() => {
    if (store.planets.length > 0) {
      actions.loadSingleView(id, setPlanetDetail, "planet", {
        name: "name",
        description: "description",
        diameter: "diameter",
        rotationPeriod: "rotation_period",
        orbitalPeriod: "orbital_period",
        population: "population",
        climate: "climate",
        terrain: "terrain",
        surfaceWater: "surface_water",
        uid: "uid",
      });
    } else {
      actions.loadData();
    }
  }, [id, store.planets]);

  function handleErrorOfImg(event) {
    event.target.src = Tatooine;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div
        className="card mb-3 bg-transparent border-warning"
        style={{ maxWidth: "1200px" }}
      >
        <div className="row g-0 flex-nowrap">
          <div className="col-md-4 m-4 mt-5">
            <img
              src={`https://starwars-visualguide.com/assets/img/planets/${planetDetails.uid}.jpg`}
              className="img-fluid rounded-start"
              alt={planetDetails.name}
              onError={handleErrorOfImg}
            />
          </div>
          <div className="card-body mt-3">
            <div className="d-flex justify-content-center flex-column">
              <h2 className="card-title text-warning">{planetDetails.name}</h2>
              <p className="card-text me-2 text-white">
                {planetDetails.description}
              </p>
              <div className="d-flex flex-row card-text">
                <div className="m-2 ms-0">
                  <small className="text-danger">Diameter</small>
                  <p className="text-white">{planetDetails.diameter}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Rotation Period</small>
                  <p className="text-white">{planetDetails.rotationPeriod}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Orbital Period</small>
                  <p className="text-white">{planetDetails.orbitalPeriod}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Population</small>
                  <p className="text-white">{planetDetails.population}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Climate</small>
                  <p className="text-white">{planetDetails.climate}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Terrain</small>
                  <p className="text-white">{planetDetails.terrain}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Water Surface</small>
                  <p className="text-white">{planetDetails.surfaceWater}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
