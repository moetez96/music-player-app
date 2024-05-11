import React, { useEffect, useState } from "react";
import UploadMusic from "../buttons/UploadMusic";
import ScanForMusic from "../buttons/ScanForMusic";
import MusicList from "./MusicList";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function MainScreen() {
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
    const tracks = await db.collection("tracks").get();
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
          <UploadMusic />
          <ScanForMusic />
        </div>
      )}
    </>
  );
}

export default MainScreen;
