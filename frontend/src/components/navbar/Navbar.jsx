import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ShingenLogo from '../../assets/mainPage/Shingen-White-Logo.png'
import styles from './Navbar.module.css'
import { Link } from 'react-router-dom'

function BasicExample() {
	return (
		<Navbar expand="lg" sticky="top" data-bs-theme="dark" className={styles.background}>
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
						<Nav.Link href="/#home">HOME</Nav.Link>
						<Nav.Link href="/#menu">MENU</Nav.Link>
						<Nav.Link href="/#reservations">RESERVATIONS</Nav.Link>
						<Nav.Link href="/#location">LOCATION</Nav.Link>
						<Nav.Link>
							<Link to="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>CATALOG</Link>
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default BasicExample;