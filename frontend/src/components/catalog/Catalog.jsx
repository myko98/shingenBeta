import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards, handleModalStatus, handleSelectedCard, setSortBy, sortBy }) => {

	const handleSortBy = (e) => {
		setSortBy(e.target.value)
		console.log(e.target.value)
	}
	return (
		<div>
			{/* Sort By dropdown */}
			<div>
				<label htmlFor="sortBy">Sort by:</label>
				<select value={sortBy} onChange={e => handleSortBy(e)} name="sortBy" id="sortBy">
					<option value="featured">Featured</option>
					<option value="price_low_high">Price (Low-High)</option>
					<option value="price_high_low">Price (High-Low)</option>
					<option value="new_arrivals">New Arrivals</option>
					<option value="a_z">Product Name (A-Z)</option>
					<option value="z_a">Product Name (Z-A)</option>
				</select>
			</div>
			<div className={styles.catalogGrid}>
				{cards.length > 0 ? (
					cards.map((card) => (
						<CatalogCard key={card.id} cardInfo={card} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} />
					))
				) : (
					<div>No cards</div>
				)}
			</div>
		</div>
	);
};

export default Catalog;
