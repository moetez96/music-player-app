import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/layout/music_list.scss";
import ScanForMusic from "../buttons/ScanForMusic";
import UploadMusic from "../buttons/UploadMusic";
import MusicCard from "../cards/MusicCard";
import OverviewCard from "../cards/OverviewCard";

function MusicList({ musicList, coverPicture, overView }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const location = useLocation();
  const isFavoritesRoute = location.pathname === "/favorites";

  useEffect(() => {
    const index = musicList.findIndex((item) => item.selected);
    if (index !== -1) {
      setCurrentTrack(musicList[index]);
    }
  }, [musicList]);


  return (
    <div className="music-list-wrapper">
      {
        <OverviewCard
          currentTrack={currentTrack}
          coverPicture={coverPicture}
          overView={overView}
        />
      }

      <div className="upload-music-icons-container">
        {!isFavoritesRoute && (
          <>
            <UploadMusic />
            <ScanForMusic />
          </>
        )}
      </div>

      {musicList.length === 0 ? (
        <></>
      ) : (
        <div className="music-list-container">
          {musicList.map((musicItem, index) => (
            <MusicCard key={index} musicItem={musicItem} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MusicList;
