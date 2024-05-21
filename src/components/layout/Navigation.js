import React from "react";
import { Link } from "react-router-dom";
import "../../styles/layout/navigation.scss";
import HomeIcon from "../icons/HomeIcon";
import PlaylistIcon from "../icons/PlaylistIcon";

function Navigation({isFavoritesRoute, handleNavigationChange}) {
  
  const handleClick = () => {
    handleNavigationChange("");
  }

  return (
    <div className="nav-wrapper">
      <Link to="/" onClick={handleClick}>
        <HomeIcon isFavoritesRoute={isFavoritesRoute}/>
      </Link>
      <Link to="/favorites" onClick={handleClick}>
        <PlaylistIcon isFavoritesRoute={isFavoritesRoute}/>
      </Link>
    </div>
  );
}

export default Navigation;
