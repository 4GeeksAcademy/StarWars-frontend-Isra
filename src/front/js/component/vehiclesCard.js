import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/starwars.css";
import { Context } from "../store/appContext";

export const VehiclesCard = ({ img, name, model, vehicleClass, type, uid }) => {
  const { store, actions } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(actions.checkIsFavoriteItem(uid, "Vehicles"));
  }, [store.favoritesVehicles]);

  type == "vehicle" ? (type = "vehicle") : "";
  const style = {
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backdropPosition: "center",
  };
  const blur = {
    backdropFilter: "blur(9px) saturate(180%)",
    backgroundColor: "rgba(17, 25, 40, 0.1)",
    padding: "0.5rem",
    borderRadius: "0.3rem",
    width: "100%",
    height: "62vh",
    maxHeight: "540px",
  };

  return (
    <div className="card mx-2 mb-1" style={{ minWidth: "18rem" }}>
      <div style={style} className="d-flex align-items-end ">
        <div style={blur} className="mx-auto">
          <figure className="mt-5">
            <img
              className="img-fluid rounded"
              src={img}
              alt={name}
              style={{ filter: "drop-shadow(0 0 0.75rem white)" }}
            />
            <div className=" align-items-center ">
              <figcaption className="text-warning my-3 bg-secondary-tertiary fs-4">
                {name}
              </figcaption>
              <div>
                <p className="text-warning">
                  Model: <span className="text-white">{model}</span>
                </p>
                <p className="text-warning">
                  Vehicle Class:{" "}
                  <span className="text-white">{vehicleClass}</span>
                </p>
              </div>
              <Link to={`/${type}/${uid}`}>
                <button className=" btn btn-outline-warning">Learn more</button>
              </Link>
              <button
                className="btn btn-outline-danger mx-2"
                onClick={() => {
                  if (isFavorite) {
                    actions.removeFavoriteItem(uid, "Vehicles");
                    console.log(store.favoritesVehicles);
                  } else {
                    actions.addFavoriteItem(uid, "Vehicles");
                    console.log(store.favoritesVehicles);
                  }
                }}
              >
                <i
                  className={
                    isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
                  }
                ></i>
              </button>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
};
