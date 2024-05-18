import React, { useEffect, useState } from "react";
import MusicList from "./MusicList";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function FavoriteScreen() {
  const [musicList, setMusicList] = useState([]);
  const db = new LocalBase("musicDB");

  useEffect(() => {
    loadTracksFromDB();

    EventEmitter.on("tracksChanged", loadTracksFromDB);

    return () => {
      EventEmitter.off("tracksChanged", loadTracksFromDB);
    };
  }, []);

  const loadTracksFromDB = async () => {
    const favorites = (await db.collection("favoriteTracks").get()).map((fav) => fav.favoriteId);
    const tracks = (await db.collection("tracks").get()).filter((track) => favorites.includes(track.id));
    setMusicList(tracks);
  };

  return (
    <>
      {musicList.length !== 0 ? (
        <div className="upload-music-list-container">
          <MusicList musicList={musicList} />
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
