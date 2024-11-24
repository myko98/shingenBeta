import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidenav';
import Catalog from '../components/catalog/Catalog';
import styles from './CatalogPage.module.css'
import CatalogModal from '../components/catalogModal/CatalogModal'
import EditCreateModal from '../components/editCreateModal/EditCreateModal'

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

const CatalogPage = ({ isAdmin }) => {
	// state for filterings
	// pass setter to sidebar
	// fetch cards on the page. if filters are applied from sidebar, filter the
	// cards and send the result into catalog
	const [filters, setFilters] = useState([])
	const [cards, setCards] = useState([])
	const [filteredCards, setFilteredCards] = useState([])
	const [selectedCard, setSelectedCard] = useState(null)
	const [openModal, setOpenModal] = useState("");
	const [refreshCards, setRefreshCards] = useState(0);

	const [sortBy, setSortBy] = useState("featured")

	const handleSelectedCard = (selectedCard) => {
		setSelectedCard(selectedCard)
	}

	const handleModalStatus = (status, modalType = "", card = null) => {
		if (status === true) {
			setOpenModal(modalType)
			setSelectedCard(card)
			console.log(card)
		}
		else {
			setOpenModal("")
			selectedCard(null)
		}
	}

	// Fetch cards on load
	useEffect(() => {
		fetchData(setCards);
	}, [refreshCards]);

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
	}, [filters, cards])

	// console.log("CARDS in CATALOGPAGE:", cards)
	useEffect(() => {
		console.log("SORT BYE: ", sortBy)
		if (sortBy === "featured") {
			setFilteredCards(cards)
		}

		let sortedCards = [...cards]

		if (sortBy === "price_low_high") {
			sortedCards = sortedCards.sort((a, b) => parseFloat(a.properties.Price) - parseFloat(b.properties.Price))
		} else if (sortBy === "price_high_low") {
			sortedCards = sortedCards.sort((a, b) => parseFloat(b.properties.Price) - parseFloat(a.properties.Price))
		} else if (sortBy === "a_z") {
			sortedCards = sortedCards.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase))
		}
		setFilteredCards(sortedCards)

	}, [sortBy, cards])


	return (
		<>
			<div className={styles.container}>
				<div className={styles.body}>
					<Sidebar setFilters={setFilters} />
					<div>
						<Catalog cards={filteredCards} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} isAdmin={isAdmin} setSortBy={setSortBy} sortBy={sortBy} />
					</div>
				</div>
			</div>
			{openModal === "catalogModal" && <CatalogModal handleModalStatus={handleModalStatus} selectedCard={selectedCard} />}
			{openModal === "editCreateModal" && <EditCreateModal setOpenModal={setOpenModal} selectedCard={selectedCard} setRefreshCards={setRefreshCards} />}

		</>


	)
}

export default CatalogPage;
