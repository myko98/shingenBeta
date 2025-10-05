import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ShingenLogo from '../../assets/mainPage/Shingen-White-Logo.png';
import styles from './Navbar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

function BasicExample() {
	// returns a location object that includes info like pathname, hash (url path)
	const location = useLocation();
	console.log('LOCATION: ', location);
	return (
		<Navbar
			expand="lg"
			sticky="top"
			data-bs-theme="dark"
			className={styles.background}
		>
			<Container>
				<Navbar.Brand href="#home">
					<img
						src={ShingenLogo}
						className={styles.navBarImg}
						alt="Shingen Logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<Nav.Link
							as={HashLink}
							to="/#home"
							className={
								(location.hash === '#home' || location.hash === '') &&
								location.pathname !== '/catalog'
									? 'active'
									: ''
							}
						>
							HOME
						</Nav.Link>
						<Nav.Link
							as={HashLink}
							to="/#menu"
							className={location.hash === '#menu' ? 'active' : ''}
						>
							MENU
						</Nav.Link>
						<Nav.Link
							as={HashLink}
							to="/#reservations"
							className={location.hash === '#reservations' ? 'active' : ''}
						>
							RESERVATIONS
						</Nav.Link>
						<Nav.Link
							as={HashLink}
							to="/#location"
							className={location.hash === '#location' ? 'active' : ''}
						>
							LOCATION
						</Nav.Link>
						<Nav.Link as={NavLink} to="/catalog" exact activeClassName="active">
							CATALOG
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default BasicExample;
