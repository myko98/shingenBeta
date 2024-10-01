import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidenav';
import Catalog from '../components/catalog/Catalog';
import DetailsModal from '../components/detailsModal/DetailsModal';
import styles from './CatalogPage.module.css';

const fetchData = async (setCards) => {
	try {
		// live: https://shingenbeta.onrender.com/sake
		// local: http://127.0.0.1:5000/sake
		const response = await fetch('http://127.0.0.1:5000/sake');
		if (!response) {
			throw new Error('Failed to fetch data');
		}
		const data = await response.json();
		setCards(data);
		console.log('DATA:', data);
	} catch (error) {
		console.log('Error: ', error);
	}
};

const CatalogPage = () => {
	// state for filterings
	// pass setter to sidebar
	// fetch cards on the page. if filters are applied from sidebar, filter the
	// cards and send the result into catalog
	const [filters, setFilters] = useState([]);
	const [cards, setCards] = useState([]);
	const [filteredCards, setFilteredCards] = useState([]);

	// State for modal
	const [modalCard, setModalCard] = useState({});
	const [openModal, setOpenModal] = useState(false);

	const handleCardClick = (card) => {
		console.log('handle card click');
		setModalCard(card);
		setOpenModal(true);
	};

	const handleModalClose = () => {
		setModalCard({});
		setOpenModal(false);
	};

	// Fetch cards on load
	useEffect(() => {
		fetchData(setCards);
	}, []);

	// Filter cards
	useEffect(() => {
		if (filters.length === 0) {
			setFilteredCards(cards);
		} else {
			const newCards = cards.filter((card) => {
				return filters.every((filter) => {
					return Object.values(card.properties).includes(filter);
				});
			});
			setFilteredCards(newCards);
		}
	}, [filters, cards]);

	return (
		<>
			<Navbar />
			<div className={styles.body}>
				<Sidebar setFilters={setFilters} />
				<Catalog cards={filteredCards} handleCardClick={handleCardClick} />
			</div>
			{/* modal component here */}
			{openModal && (
				<DetailsModal
					modalCard={modalCard}
					handleModalClose={handleModalClose}
				/>
			)}
		</>
	);
};

export default CatalogPage;
