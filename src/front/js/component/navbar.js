import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/SWLogo.png";

export const Navbar = () => {
  return (
    <nav
      className="navbar navbar-dark"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="container d-flex justify-content-between align-items-center">
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
          className="text-white  mx-2 me-auto fs-5"
          style={{ textDecoration: "none" }}
        >
          Vehicles
        </Link>

        <Link to="/demo" className="ml-auto">
          <button className="btn btn-danger">Favourites</button>
        </Link>
      </div>
    </nav>
  );
};
