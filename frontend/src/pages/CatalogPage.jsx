import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidenav';
import Catalog from '../components/catalog/Catalog';
import styles from './CatalogPage.module.css'
import CatalogModal from '../components/catalogModal/CatalogModal'

const CatalogPage = () => {
	// state for filterings
	// pass setter to sidebar
	// fetch cards on the page. if filters are applied from sidebar, filter the
	// cards and send the result into catalog
	const [filters, setFilters] = useState([])
	const [cards, setCards] = useState([])
	const [filteredCards, setFilteredCards] = useState([])
	const [selectedCard, setSelectedCard] = useState(null)
	const [openModal, setOpenModal] = useState("");
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

	const fetchData = async () => {
		try {
			const response = await fetch(
				`https://cdn.contentful.com/spaces/${import.meta.env.VITE_CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${import.meta.env.VITE_CONTENTFUL_ACCESS_ID}&content_type=sake`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			console.log("CONTENTFUL")
			console.log(data)

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

			console.log("Mapped Items:", items); // Check the mapped items
			setCards(items)

		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Filter cards
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

	// TODO: not sure if this is needed anymore. will comment out for now.
	// useEffect(() => {
	// 	console.log("SORT BYE: ", sortBy)
	// 	if (sortBy === "featured") {
	// 		setFilteredCards(cards)
	// 	}

	// 	let sortedCards = [...cards]

	// 	if (sortBy === "price_low_high") {
	// 		sortedCards = sortedCards.sort((a, b) => parseFloat(a.properties.Price) - parseFloat(b.properties.Price))
	// 	} else if (sortBy === "price_high_low") {
	// 		sortedCards = sortedCards.sort((a, b) => parseFloat(b.properties.Price) - parseFloat(a.properties.Price))
	// 	} else if (sortBy === "a_z") {
	// 		sortedCards = sortedCards.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase))
	// 	}
	// 	setFilteredCards(sortedCards)

	// }, [sortBy, cards])

	return (
		<>
			<div className={styles.container}>
				<div className={styles.body}>
					<Sidebar setFilters={setFilters} />
					<div>
						<Catalog cards={filteredCards} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} setSortBy={setSortBy} sortBy={sortBy} />
					</div>
				</div>
			</div>
			{openModal === "catalogModal" && <CatalogModal handleModalStatus={handleModalStatus} selectedCard={selectedCard} />}
		</>
	)
}

export default CatalogPage;
