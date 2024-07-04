import React, { useContext, useEffect } from "react";
import "../../styles/home.css";
import { Context } from "../store/appContext";

import "../../styles/starwars.css";
import { VehiclesCard } from "../component/vehiclesCard";

export const Vehicles = () => {
  const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.loadData();
  }, []);

  return (
    <>
      <h1 className="text-center text-white mt-2">Vehicles</h1>
      <div className=" d-flex justify-content-center text-center mt-5 ">
        <div className="container d-flex overflow-auto ">
          {store.vehicles.map((vehicle) => (
            <VehiclesCard
              key={vehicle.uid}
              img={`https://starwars-visualguide.com/assets/img/vehicles/${vehicle.uid}.jpg`}
              name={vehicle.name}
              model={vehicle.model}
              vehicleClass={vehicle.vehicle_class}
              type={"vehicles"}
              uid={vehicle.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
};
