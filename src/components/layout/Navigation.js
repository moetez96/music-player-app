import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/layout/navigation.scss";
import HomeIcon from "../icons/HomeIcon";
import PlaylistIcon from "../icons/PlaylistIcon";

function Navigation() {
  const location = useLocation();
  const isFavoritesRoute = location.pathname === "/favorites";

  return (
    <div className="nav-wrapper">
      <Link to="/">
        <HomeIcon isFavoritesRoute={isFavoritesRoute}/>
      </Link>
      <Link to="/favorites">
        <PlaylistIcon isFavoritesRoute={isFavoritesRoute}/>
      </Link>
    </div>
  );
}

export default Navigation;
