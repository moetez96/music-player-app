import React from "react";
import { Link } from "react-router-dom";
import "../../styles/layout/navigation.scss";
import HomeIcon from "../icons/HomeIcon";
import PlaylistIcon from "../icons/PlaylistIcon";

function Navigation() {
  return (
    <div className="nav-wrapper">
      <Link to="/">
        <HomeIcon />
      </Link>
      <Link to="/favorites">
        <PlaylistIcon />
      </Link>
    </div>
  );
}

export default Navigation;
