import UploadMusic from "../buttons/UploadMusic";
import ScanForMusic from "../buttons/ScanForMusic";
import MusicList from "./MusicList";
import { useEffect, useState } from "react";

function MainScreen() {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {

    const updateMusicList = () => {
        const listM = JSON.parse(localStorage.getItem("musicList")) || [];
        setMusicList(listM);
      };
      updateMusicList();
        window.addEventListener("storage", updateMusicList);
      return () => {
        window.removeEventListener("storage", updateMusicList);
      };
  }, []);

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
