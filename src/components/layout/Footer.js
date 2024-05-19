import '../../styles/layout/footer.scss'
import MusicPlayer from '../MusicPlayer';

function Footer({overView, updateOverView}) {
    
    return (
        <div className='footer-wrapper'>
            <MusicPlayer overView={overView} updateOverView={updateOverView}/>
        </div>
    );
}

export default Footer;