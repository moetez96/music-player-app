import React, { useEffect, useState } from "react";
import MusicList from "./MusicList";
import EventEmitter from "../../services/EventEmitter";
import { loadFavoriteTracksFromDB } from "../../services/MusicDBService";

function FavoriteScreen({
  searchText,
  musicList,
  coverPicture,
  overView,
  updateOverView,
}) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    loadTracksFromDB();

    EventEmitter.on("tracksChanged", loadTracksFromDB);

    return () => {
      EventEmitter.off("tracksChanged", loadTracksFromDB);
    };
  }, []);

  const loadTracksFromDB = async () => {
    const favorites = await loadFavoriteTracksFromDB();
    const favoritesTracks = musicList?.filter((track) =>
      favorites?.includes(track.id)
    );
    setTracks(favoritesTracks);
  };

  return (
    <>
      {musicList.length !== 0 ? (
        <div className="upload-music-list-container">
          <MusicList
            musicList={tracks}
            coverPicture={coverPicture}
            overView={overView}
            updateOverView={updateOverView}
          />
        </div>
      ) : (
        <div className="upload-music-buttons-container">No Favorites Yet</div>
      )}
    </>
  );
}

export default FavoriteScreen;
