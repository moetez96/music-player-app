import UploadMusic from "../buttons/UploadMusic";
import ScanForMusic from "../buttons/ScanForMusic";

function MainScreen() {

    return (
        <div className="upload-music-buttons-container">
            <UploadMusic/>
            <ScanForMusic/>
        </div>
    );
}

export default MainScreen;