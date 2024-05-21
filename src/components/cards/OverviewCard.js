import React, { useEffect } from "react";
import placeHolderImage from "../../styles/assets/images/music_placeholder.jpg";

function OverviewCard({ currentTrack, coverPicture, overView }) {

  useEffect(() => {
    if (coverPicture && currentTrack && overView) {
      const element = document.querySelector(
        ".music-playing-overview-background"
      );

      if (element) {
        element.style.backgroundImage = `
        linear-gradient(to top, rgba(29, 33, 35, 1) 30%,
        rgba(29, 33, 35, 0.9) 50%,
        rgba(29, 33, 35, 0.85) 60%,
        rgba(29, 33, 35, 0.79) 80%,
        rgba(29, 33, 35, 0.7) 100%),
        url(${coverPicture})`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
      }
    }
  }, [currentTrack, coverPicture, overView]);


  return (
    <>
      {overView && (
        <>
          <div className="music-playing-overview-background"></div>
          <div className="music-playing-overview-container">
            <img
              className="music-playing-overview-img"
              src={coverPicture ? coverPicture : placeHolderImage}
              alt="overview-img"
            />
            <div className="music-playing-overview-desc">
              {currentTrack?.title && currentTrack?.title !== "Unknown" ? (
                <span className="overview-title">{currentTrack?.title}</span>
              ) : (
                <></>
              )}
              {currentTrack?.artist && currentTrack?.artist !== "Unknown" ? (
                <p className="overview-artist">{currentTrack?.artist}</p>
              ) : (
                <></>
              )}
              {currentTrack?.album && currentTrack?.album !== "Unknown" ? (
                <p className="overview-album">{currentTrack?.album}</p>
              ) : (
                <></>
              )}
              {currentTrack?.genre && currentTrack?.genre !== "Unknown" ? (
                <p className="overview-genre">{currentTrack?.genre}</p>
              ) : (
                <></>
              )}
              {currentTrack?.composer &&
              currentTrack?.composer !== "Unknown" ? (
                <p className="overview-composer">{currentTrack?.composer}</p>
              ) : (
                <></>
              )}
              {currentTrack?.releaseDate &&
              currentTrack?.releaseDate !== "Unknown" ? (
                <p className="overview-releaseDate">
                  {currentTrack?.releaseDate}
                </p>
              ) : (
                <></>
              )}
              {currentTrack?.copyright &&
              currentTrack?.copyright !== "Unknown" ? (
                <p className="overview-copyright">{currentTrack?.copyright}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OverviewCard;
