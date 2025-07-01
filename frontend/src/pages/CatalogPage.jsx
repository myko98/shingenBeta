import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidenav';
import Catalog from '../components/catalog/Catalog';
import styles from './CatalogPage.module.css'
import CatalogModal from '../components/catalogModal/CatalogModal'

// Page that houses the Catalog and Sidebar components
const CatalogPage = () => {
	// state for filterings
	// pass setter to sidebar
	// fetch cards on the page. if filters are applied from sidebar, filter the
	// cards and send the result into catalog
	const [filters, setFilters] = useState([])
	// Original cards
	const [cards, setCards] = useState([])
	const [filteredCards, setFilteredCards] = useState([])
	const [selectedCard, setSelectedCard] = useState(null)
	const [openModal, setOpenModal] = useState("");
	// Sorted dropdown value
	const [sortBy, setSortBy] = useState("featured")

	const handleSelectedCard = (selectedCard) => {
		setSelectedCard(selectedCard)
	}

	const handleModalStatus = (status, modalType = "", card = null) => {
		if (status === true) {
			setOpenModal(modalType)
			setSelectedCard(card)
		}
		else {
			setOpenModal("")
			selectedCard(null)
		}
	}

	// Fetches data from Contentful API
	const fetchData = async () => {
		try {
			const response = await fetch(
				`https://cdn.contentful.com/spaces/${import.meta.env.VITE_CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${import.meta.env.VITE_CONTENTFUL_ACCESS_ID}&content_type=sake`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();

			// Iterate data and set items state
			const items = data.items.map((item) => {
				const imageId = item.fields.sakeImage.sys.id; // Get the image ID
				const asset = data.includes.Asset.find((a) => a.sys.id === imageId); // Find the matching asset
				const imageUrl = asset ? `https:${asset.fields.file.url}` : ''; // Get the image URL if asset is found

				const { cardMessage, description, name, price, sakeImage, ...properties } = item.fields

				return {
					id: item.sys.id,
					name,
					price,
					cardMessage,
					description,
					properties: { ...properties },
					image: imageUrl, // Set resolved image URL
				};
			});

			// console.log("Mapped Items:", items); // Check the mapped items
			setCards(items)

		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	// Filter cards (Based on Side Nav Bar)
	useEffect(() => {
		// if no filters selected, then select all cards
		if (filters.length === 0) {
			setFilteredCards(cards);
		}
		// else filter cards based on selected properties
		else {
			const newCards = cards.filter((card) => {
				return filters.every((filter) => {
					return Object.values(card.properties).includes(filter);
				});
			});
			setFilteredCards(newCards);
		}
	}, [filters, cards])

	// Updates list of cards when SORT BY filter value is changed
	useEffect(() => {
		console.log(cards)
		// New filtered cards
		let filteredCards
		if (sortBy === "price_low_high") {
			filteredCards = [...cards].sort((a, b) => a.price - b.price)
			setFilteredCards(filteredCards);
		}
		else if (sortBy === "price_high_low") {
			filteredCards = [...cards].sort((a, b) => b.price - a.price)
			setFilteredCards(filteredCards);
		}
		// Filter for sakes that have the new label
		else if (sortBy === "new_arrivals") {
			console.log(cards)
			filteredCards = [...cards].filter((card) => card.properties.new === true)
			console.log(filteredCards)
			setFilteredCards(filteredCards);
		}
		// Sort alphabetically
		else if (sortBy === "a_z") {
			filteredCards = [...cards].sort((a, b) => {
				return a.name.localeCompare(b.name)
			})
			console.log("Filtered cards")
			setFilteredCards(filteredCards)
		}
		// Sort reverse alphabetically
		else if (sortBy === "z_a") {
			filteredCards = [...cards].sort((a, b) => {
				return b.name.localeCompare(a.name)
			})
			setFilteredCards(filteredCards)
		}
		else if (sortBy === "featured") { setFilteredCards(cards) }

	}, [sortBy, cards])

	return (
		<>
			<div className={styles.container}>
				<div className={styles.body}>
					<Sidebar setFilters={setFilters} />
					<div>
						<div className={styles.header}>
							<h1>Premium Sake Collection</h1>
							<p>Discover our curated selection of authentic Japanese sake from renowned breweries across Japan</p>
						</div>
						<Catalog cards={filteredCards} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} setSortBy={setSortBy} sortBy={sortBy} />
					</div>
				</div>
			</div>
			{openModal === "catalogModal" && <CatalogModal handleModalStatus={handleModalStatus} selectedCard={selectedCard} />}
		</>
	)
}

export default CatalogPage;
