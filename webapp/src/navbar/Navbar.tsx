import './Navbar.css'
import Logo from '../assets/logo_light.svg'

type Props = {
    children: React.ReactNode
}

function Navbar(props: Props) {
    return <div className="navbar">
        <div>
            <img className='navbar-logo' src={Logo} />
            <h1 className='navbar-logo-text'>caw!nect</h1>
        </div>
        <div>
            {props.children}
        </div>
    </div>
}

export default Navbar