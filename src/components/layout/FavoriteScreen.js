import React, { useEffect, useState } from "react";
import MusicList from "./MusicList";

function FavoriteScreen({favoriteMusicList,
                          coverPicture,
                          overView,
                          updateOverView,}) {

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (favoriteMusicList) {
      setTracks(favoriteMusicList)
    }
  }, [favoriteMusicList])

  return (
    <>
      {tracks.length !== 0 ? (
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
