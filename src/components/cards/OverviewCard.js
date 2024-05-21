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
              <span className="overview-title">{currentTrack?.title}</span>

              <p className="overview-artist">
                <span>Artist: </span>
                {currentTrack?.artist && currentTrack?.artist !== "Unknown" ? (
                  <>{currentTrack?.artist}</>
                ) : (
                  <>--</>
                )}
              </p>
              <p className="overview-album">
                <span>Album: </span>
                {currentTrack?.album && currentTrack?.album !== "Unknown" ? (
                  <>{currentTrack?.album}</>
                ) : (
                  <>--</>
                )}
              </p>
              <p className="overview-genre">
                <span>Genre: </span>
                {currentTrack?.genre && currentTrack?.genre !== "Unknown" ? (
                  <>{currentTrack?.genre}</>
                ) : (
                  <>--</>
                )}
              </p>

              <p className="overview-releaseDate">
                <span>Release Date: </span>
                {currentTrack?.releaseDate &&
                currentTrack?.releaseDate !== "Unknown" ? (
                  <>{currentTrack?.releaseDate}</>
                ) : (
                  <>--</>
                )}
              </p>

              <p className="overview-copyright">
                <span>Copyright: </span>
                {currentTrack?.copyright &&
                currentTrack?.copyright !== "Unknown" ? (
                  <>{currentTrack?.copyright}</>
                ) : (
                  <>--</>
                )}
              </p>

              <p className="overview-composer">
                <span>Composer: </span>
                {currentTrack?.composer &&
                currentTrack?.composer !== "Unknown" ? (
                  <>{currentTrack?.composer}</>
                ) : (
                  <>--</>
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OverviewCard;
