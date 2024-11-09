import MainPage from '../assets/mainPage/Mainpage.jpg'
import Aboutus from '../assets/mainPage/Aboutus.jpg'
import Kushiyaki from '../assets/mainPage/Kushiyaki-01.jpg'
import CovidMenu03 from '../assets/mainPage/ShingenCovidMenu-03.jpg'
import CovidMenu04 from '../assets/mainPage/ShingenCovidMenu-04.jpg'
import CovidMenu05 from '../assets/mainPage/ShingenCovidMenu-05.jpg'
import CovidMenu06 from '../assets/mainPage/ShingenCovidMenu-06.jpg'
import CovidMenu07 from '../assets/mainPage/ShingenCovidMenu-07.jpg'
import SakeFlight from '../assets/mainPage/Sakeflightmain-01-01.jpg'
import DrinkMenu02 from '../assets/mainPage/ShingenDrinkMenu-02.jpg'
import DrinkMenu03 from '../assets/mainPage/ShingenDrinkMenu-03.jpg'
import DrinkMenu04 from '../assets/mainPage/ShingenDrinkMenu-04.jpg'
import DrinkMenu05 from '../assets/mainPage/ShingenDrinkMenu-05.jpg'
import DrinkMenu06 from '../assets/mainPage/ShingenDrinkMenu-06.jpg'
import Reservations from '../assets/mainPage/Reservations.jpg'
import ShingenCrest from '../assets/mainPage/Shingen-White-Crest.png'
import styles from './HomePage.module.css'

import Navbar from '../components/navbar/Navbar'


const HomePage = () => {
	return (
		<div id="home" className={styles.container}>
			<img src={MainPage} />
			<div className={styles.section}>
				<img src={ShingenCrest} />
				<p>ABOUT US</p>
			</div>
			<img src={Aboutus} />
			<div id="menu" className={styles.section}>
				<p>Ottawa's very own slice of Japanese Izakaya Cuisine.
					Traditional and modern izakaya sharing dishes true to Japan.</p>
				<img src={ShingenCrest} />
				<p>MENU</p>
			</div>
			<img src={Kushiyaki} />
			<img src={CovidMenu03} />
			<img src={CovidMenu04} />
			<img src={CovidMenu05} />
			<img src={CovidMenu06} />
			<img src={CovidMenu07} />
			<img src={SakeFlight} />
			<img src={DrinkMenu02} />
			<img src={DrinkMenu03} />
			<img src={DrinkMenu04} />
			<img src={DrinkMenu05} />
			<img src={DrinkMenu06} />
			<div id="reservations" className={styles.section}>
				<img src={ShingenCrest} />
				<p>RESERVATIONS</p>
			</div>
			<img src={Reservations} />
			<div id="location" className={styles.section}>
				<p>Please contact us by phone to make a reservation at 613.680.0802
					your table will be held for a maximum of 10 minutes after your reservation time</p>
				<img src={ShingenCrest} />
				<p>LOCATION</p>
			</div>
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2800.5896035992373!2d-75.70069082263507!3d45.41761473654405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce05acabb880bd%3A0x386d5df1b6338c49!2sIzakaya%20Shingen!5e0!3m2!1sen!2sca!4v1730583399480!5m2!1sen!2sca"
				width="1200"
				height="450"
				style={{ border: 0 }}
				allowFullScreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				title="Izakaya Shingen Location"
			></iframe>
			<footer>
				<div className="socials"></div>
				<div className={styles.footerGrid}>
					<div>201 Bank Street
						Ottawa, Ontario
						K2P 1W7</div>
					<div></div>
					<div>Hours
						Monday-Closed

						Tuesday, Wednesday, Thursday
						5:00pm - 10:00pm

						Friday & Saturday
						5:00pm - 12am

						Sunday
						5:00pm - 10:00pm</div>
				</div>
				<div>all rights reserved</div>
			</footer>

		</div >
	)
}

export default HomePage