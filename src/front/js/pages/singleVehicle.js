import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const SingleVehicle = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [vehicleDetails, setVehicleDetail] = useState({
    name: "",
    description: "",
    model: "",
    vehicleClass: "",
    manufacturer: "",
    length: "",
    crew: "",
    passengers: "",
    maxSpeed: "",
  });

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (store.vehicles.length > 0) {
      actions.loadSingleView(id, setVehicleDetail, "vehicle", {
        name: "name",
        description: "description",
        model: "model",
        vehicleClass: "vehicle_class",
        manufacturer: "manufacturer",
        length: "length",
        crew: "crew",
        passengers: "passengers",
        maxSpeed: "max_atmosphering_speed",
        uid: "uid",
      });
      setIsFavorite(actions.checkIsFavoriteItem(id, "Vehicles"));
    } else {
      actions.loadData();
    }
  }, [id, store.vehicles, store.favoritesVehicles]);
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div
        className="card mb-3 bg-transparent border-warning"
        style={{ maxWidth: "1200px" }}
      >
        <div className="row g-0 flex-nowrap">
          <div className="col-md-4 m-4 mt-5">
            <img
              src={`https://starwars-visualguide.com/assets/img/vehicles/${vehicleDetails.uid}.jpg`}
              className="img-fluid rounded-start"
              alt={vehicleDetails.name}
            />
          </div>
          <div className="card-body mt-3">
            <div className="d-flex justify-content-center flex-column">
              <h2 className="card-title text-warning">{vehicleDetails.name}</h2>
              <p className="card-text me-2 text-white">
                {vehicleDetails.description}
              </p>
              <div className="d-flex flex-row card-text">
                <div className="m-2 ms-0">
                  <small className="text-danger">Model</small>
                  <p className="text-white">{vehicleDetails.model}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Vehicles Class</small>
                  <p className="text-white">{vehicleDetails.vehicleClass}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Manufacturer</small>
                  <p className="text-white">{vehicleDetails.manufacturer}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Length</small>
                  <p className="text-white">{vehicleDetails.length}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Crew</small>
                  <p className="text-white">{vehicleDetails.crew}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Passengers</small>
                  <p className="text-white">{vehicleDetails.passengers}</p>
                </div>
                <div className="m-2">
                  <small className="text-danger">Max speed in atmosphere</small>
                  <p className="text-white">{vehicleDetails.maxSpeed}</p>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-outline-danger mx-2"
                  onClick={() => {
                    if (isFavorite) {
                      actions.removeFavoriteItem(id, "Vehicles");
                      console.log(store.favoritesVehicles);
                    } else {
                      actions.addFavoriteItem(id, "Vehicles");
                      console.log(store.favoritesVehicles);
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
