import UploadMusic from "../buttons/UploadMusic";
import ScanForMusic from "../buttons/ScanForMusic";
import MusicList from "./MusicList";

function MainScreen() {

    return (
        <div className="upload-music-list-container">
            <MusicList/>
        </div>
        /*<div className="upload-music-buttons-container">
            <UploadMusic/>
            <ScanForMusic/>
        </div>*/
    );
}

export default MainScreen;