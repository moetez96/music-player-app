import '../../styles/layout/header.scss'
import SearchBar from '../forms/SearchBar';
import Logo from '../icons/Logo';

function Header() {

    return (
        <div className='header-wrapper'>
            <Logo/>
            <SearchBar/>
        </div>
    )
}

export default Header;