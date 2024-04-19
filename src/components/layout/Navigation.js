import '../../styles/layout/navigation.scss'
import HomeIcon from '../icons/HomeIcon';
import PlaylistIcon from '../icons/PlaylistIcon';
import RadioIcon from '../icons/RadioIcon';

function Navigation() {

    return(
        <div className="nav-wrapper">
                <HomeIcon/>
                <PlaylistIcon/>
                <RadioIcon/>
        </div>
    );
}

export default Navigation;