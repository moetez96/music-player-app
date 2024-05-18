import UploadMusic from "../buttons/UploadMusic";
import ScanForMusic from "../buttons/ScanForMusic";
import MusicList from "./MusicList";

function MainScreen({musicList, coverPicture}) {

  return (
    <>
      {musicList.length !== 0 ? (
        <div className="upload-music-list-container">
          <MusicList musicList={musicList} coverPicture={coverPicture}/>
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
