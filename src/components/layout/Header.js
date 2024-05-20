import { useState } from "react";
import {
  loadFavoriteTracksFromDB,
  loadTracksFromDB,
} from "../../services/MusicDBService";
import "../../styles/layout/header.scss";
import SearchCard from "../cards/SearchCard";
import SearchBar from "../forms/SearchBar";
import Logo from "../icons/Logo";
import { useLocation } from "react-router-dom";

function Header({ searchText, handleNavigationChange }) {
  const [musicList, setMusicList] = useState([]);
  const location = useLocation();
  const isFavoritesRoute = location.pathname === "/favorites";

  async function searchSetTracks(text) {
    handleNavigationChange(text);
  
    try {
      const tracks = await loadTracksFromDB();
  
      if (!Array.isArray(tracks)) {
        console.error("tracks is not an array", tracks);
        setMusicList([]);
        return;
      }
  
      if (isFavoritesRoute) {
        const favorites = await loadFavoriteTracksFromDB();
  
        if (!Array.isArray(favorites)) {
          console.error("favorites is not an array", favorites);
          setMusicList([]);
          return;
        }
  
        const favoritesTracks = tracks.filter(
          (track) =>
            favorites.includes(track.id) &&
            track.title.toLowerCase().includes(text.toLowerCase())
        );
        setMusicList(favoritesTracks);
      } else {
        const filteredTracks = tracks.filter((elem) =>
          elem.title.toLowerCase().includes(text.toLowerCase())
        );
        setMusicList(filteredTracks);
      }
    } catch (error) {
      console.error("Error loading tracks", error);
      setMusicList([]);
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
              <p>Found: {musicList?.length}</p>
              {musicList?.map((musicItem) => (
                <span onClick={handleClickSearch}>
                  <SearchCard musicItem={musicItem} />
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
