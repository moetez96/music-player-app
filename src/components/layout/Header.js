import { useState } from "react";
import "../../styles/layout/header.scss";
import SearchCard from "../cards/SearchCard";
import SearchBar from "../forms/SearchBar";
import Logo from "../icons/Logo";

function Header({ musicList, favoriteMusicList, isFavoritesRoute, searchText, handleNavigationChange }) {
  const [tracks, setTracks] = useState([]);

  async function searchSetTracks(text) {
    handleNavigationChange(text);
    try {
  
      if (isFavoritesRoute) {

        if (!Array.isArray(favoriteMusicList)) {
          console.error("favorites is not an array", favoriteMusicList);
          setTracks([]);
          return;
        }
  
        const favoritesTracks = favoriteMusicList.filter(
          (track) =>
              track.title.toLowerCase().includes(text.toLowerCase())
        );
        setTracks(favoritesTracks);
      } else {
        const filteredTracks = musicList.filter((elem) =>
          elem.title.toLowerCase().includes(text.toLowerCase())
        );
        setTracks(filteredTracks);
      }
    } catch (error) {
      console.error("Error loading tracks", error);
      setTracks([]);
    }
  }

  const handleClickSearch = () => {
    handleNavigationChange("")
  }

  return (
    <div className="header-wrapper">
      <Logo />
      <SearchBar searchText={searchText} searchSetTracks={searchSetTracks} />
      {searchText !== "" && (
        <div className="search-result-wrapper">
          {musicList?.length !== 0 ? (
            <>
              <p>Found: {tracks?.length}</p>
              {tracks?.map((track) => (
                <span onClick={handleClickSearch}>
                  <SearchCard musicItem={track} />
                </span>
              ))}
            </>
          ) : (
            <p>No tracks found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
