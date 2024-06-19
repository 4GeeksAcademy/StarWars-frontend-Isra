import React from "react";
import { Link } from "react-router-dom";
import Tatooine from "../../img/Tatooine_TPM.webp";

export const PlanetCard = ({ img, name, terrain, population, type, uid }) => {
  type == "planets" ? (type = "planets") : "";
  const style = {
    backgroundImage: name === "Tatooine" ? `url(${Tatooine})` : `url(${img})`,
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
    height: "72vh",
  };

  function handleErrorOfImg(event) {
    event.target.src = Tatooine;
  }
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
              onError={handleErrorOfImg}
            />
            <div className=" align-items-center ">
              <figcaption className="text-warning my-3 bg-secondary-tertiary fs-4">
                {name}
              </figcaption>
              <div>
                <p className="text-warning">
                  Terrain: <span className="text-white">{terrain} </span>{" "}
                </p>
                <p className="text-warning">
                  Population: <span className="text-white">{population}</span>{" "}
                </p>
              </div>
              <Link className="btn btn-outline-warning" to={`/${type}/${uid}`}>
                <span className=" bg-light-subtle">Learn more</span>
              </Link>
              <span className="btn btn-outline-danger mx-2">
                <i className="fa-regular fa-heart"></i>
              </span>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
};
