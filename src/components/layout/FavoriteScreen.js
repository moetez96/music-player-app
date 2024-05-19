import React, { useEffect, useState } from "react";
import MusicList from "./MusicList";
import EventEmitter from "../../services/EventEmitter";
import { loadFavoriteTracksFromDB } from "../../services/MusicDBService";

function FavoriteScreen({coverPicture, overView, updateOverView}) {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {
    loadTracksFromDB();

    EventEmitter.on("tracksChanged", loadTracksFromDB);

    return () => {
      EventEmitter.off("tracksChanged", loadTracksFromDB);
    };
  }, []);

  const loadTracksFromDB = async () => {
    const tracks = await loadFavoriteTracksFromDB();
    setMusicList(tracks);
  };

  return (
    <>
      {musicList.length !== 0 ? (
        <div className="upload-music-list-container">
          <MusicList musicList={musicList} coverPicture={coverPicture} overView={overView} updateOverView={updateOverView}/>
        </div>
      ) : (
        <div className="upload-music-buttons-container">
          No Favorites Yet
        </div>
      )}
    </>
  );
}

export default FavoriteScreen;
