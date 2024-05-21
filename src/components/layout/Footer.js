import '../../styles/layout/footer.scss'
import MusicPlayer from '../MusicPlayer';

function Footer({favoriteMusicList, musicList, coverPicture, isFavoritesRoute, overView, updateOverView}) {
    return (
        <div className='footer-wrapper'>
            <MusicPlayer
                favoriteMusicList={favoriteMusicList} musicList={musicList}
                coverPicture={coverPicture} isFavoritesRoute={isFavoritesRoute} overView={overView} updateOverView={updateOverView}/>
        </div>
    );
}

export default Footer;