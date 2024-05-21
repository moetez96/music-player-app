import '../../styles/layout/footer.scss'
import MusicPlayer from '../MusicPlayer';

function Footer({isFavoritesRoute, overView, updateOverView}) {
    
    return (
        <div className='footer-wrapper'>
            <MusicPlayer isFavoritesRoute={isFavoritesRoute} overView={overView} updateOverView={updateOverView}/>
        </div>
    );
}

export default Footer;