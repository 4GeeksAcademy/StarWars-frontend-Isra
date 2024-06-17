import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const CharacterCard = (props) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="card" style={{ width: "280px", height: "80vh" }}>
      <img
        src={props.img}
        className="card-img-top"
        alt="img1"
        style={{ objectFit: "fill" }}
      />
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <div className="card-text ">
          <p>Gender:</p>
          <p>Hair:</p>
          <p>Age:</p>
          <p>Eyes:</p>
        </div>
        <a href="#" className="btn btn-primary">
          Learn More
        </a>
      </div>
    </div>
  );
};
