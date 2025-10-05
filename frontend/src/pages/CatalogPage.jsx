import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidenav';
import Catalog from '../components/catalog/Catalog';
import styles from './CatalogPage.module.css';
import CatalogModal from '../components/catalogModal/CatalogModal';

// Page that houses the Catalog and Sidebar components
const CatalogPage = () => {
	const [cards, setCards] = useState([]);
	const [filteredCards, setFilteredCards] = useState([]);
	const [selectedCard, setSelectedCard] = useState(null);
	const [openModal, setOpenModal] = useState('');
	// Sorted dropdown value
	const [sortBy, setSortBy] = useState('featured');

	// Filter states
	const [filterByTaste, setFilterByTaste] = useState('all');
	const [filterByPrice, setFilterByPrice] = useState('all');
	const [filterByCategory, setFilterByCategory] = useState('all');

	const handleModalStatus = (status, modalType = '', card = null) => {
		if (status === true) {
			setOpenModal(modalType);
			setSelectedCard(card);
		} else {
			setOpenModal('');
			selectedCard(null);
		}
	};

	// Filter handlers
	const handleFilterByTaste = (e) => {
		console.log('Taste: ', e.target.value);
		setFilterByTaste(e.target.value);
	};
	const handleFilterByPrice = (e) => {
		console.log('Price: ', e.target.value);
		setFilterByPrice(e.target.value);
	};
	const handleFilterByCategory = (e) => {
		console.log('Category: ', e.target.value);
		setFilterByCategory(e.target.value);
	};

	// Fetches all cards from Contentful API, set the cards to our schema and cards react state
	const fetchData = async () => {
		try {
			const response = await fetch(
				`https://cdn.contentful.com/spaces/${
					import.meta.env.VITE_CONTENTFUL_SPACE_ID
				}/environments/master/entries?access_token=${
					import.meta.env.VITE_CONTENTFUL_ACCESS_ID
				}&content_type=sake`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();

			// console.log('DATA: ', data);

			// Iterate data and set items state
			const items = data.items.map((item) => {
				const imageId = item.fields.sakeImage.sys.id; // Get the image ID
				const asset = data.includes.Asset.find((a) => a.sys.id === imageId); // Find the matching asset
				const imageUrl = asset ? `https:${asset.fields.file.url}` : ''; // Get the image URL if asset is found

				const { cardMessage, description, name, price, ...properties } =
					item.fields;

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
			setCards(items);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	// Fetch all cards on initial rendar
	useEffect(() => {
		fetchData();
	}, []);

	// Updates list of cards when SORT BY filter value is changed
	useEffect(() => {
		// New filtered cards
		let filteredCards;
		if (sortBy === 'price_low_high') {
			filteredCards = [...cards].sort((a, b) => a.price - b.price);
			setFilteredCards(filteredCards);
		} else if (sortBy === 'price_high_low') {
			filteredCards = [...cards].sort((a, b) => b.price - a.price);
			setFilteredCards(filteredCards);
		}
		// Filter for sakes that have the new label
		else if (sortBy === 'new_arrivals') {
			console.log(cards);
			filteredCards = [...cards].filter((card) => card.properties.new === true);
			console.log(filteredCards);
			setFilteredCards(filteredCards);
		}
		// Sort alphabetically
		else if (sortBy === 'a_z') {
			filteredCards = [...cards].sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
			console.log('Filtered cards');
			setFilteredCards(filteredCards);
		}
		// Sort reverse alphabetically
		else if (sortBy === 'z_a') {
			filteredCards = [...cards].sort((a, b) => {
				return b.name.localeCompare(a.name);
			});
			setFilteredCards(filteredCards);
		}
		// Default case
		else if (sortBy === 'featured') {
			setFilteredCards(cards);
		}
	}, [sortBy, cards]);

	return (
		<>
			<div className={styles.body}>
				<div className={styles.header}>
					<h1>Premium Sake Collection</h1>
					<p>
						Discover our curated selection of authentic Japanese sake from
						renowned breweries across Japan
					</p>
				</div>
				<Catalog
					cards={filteredCards}
					handleModalStatus={handleModalStatus}
					// handleSelectedCard={handleSelectedCard}
					setSortBy={setSortBy}
					sortBy={sortBy}
					filterByTaste={filterByTaste}
					handleFilterByTaste={handleFilterByTaste}
					filterByPrice={filterByPrice}
					handleFilterByPrice={handleFilterByPrice}
					filterByCategory={filterByCategory}
					handleFilterByCategory={handleFilterByCategory}
				/>
			</div>
			{openModal === 'catalogModal' && (
				<CatalogModal
					handleModalStatus={handleModalStatus}
					selectedCard={selectedCard}
				/>
			)}
		</>
	);
};

export default CatalogPage;
