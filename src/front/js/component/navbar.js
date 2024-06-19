import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/SWLogo.png";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">
            {" "}
            <img style={{ width: "5em" }} src={logo}></img>
          </span>
        </Link>
        <div className="ml-auto">
          <Link to="/demo">
            <button className="btn btn-primary">Favourites</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
