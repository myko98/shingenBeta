import React, { useState } from 'react';
import styles from './Navbar.module.css'; // Import your CSS for styling

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className={styles.navbar}>
			<div className="logo">MyLogo</div>
			<ul className={`${styles.navLinks} ${isOpen ? 'open' : ''}`}>
				<li><a href="#home">Home</a></li>
				<li><a href="#about">About</a></li>
				<li><a href="#contact">Contact</a></li>
			</ul>
			<div className="burger" onClick={toggleMenu}>
				<div className="line1"></div>
				<div className="line2"></div>
				<div className="line3"></div>
			</div>
		</nav>
	);
};

export default Navbar;