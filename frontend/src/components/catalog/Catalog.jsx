import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards, handleModalStatus, handleSelectedCard, isAdmin, setSortBy, sortBy }) => {

	const handleLogout = async () => {
		const response = await fetch('http://127.0.0.1:5000/logout', {
			method: "POST",
		})

		localStorage.removeItem("token") // Remove token from local storage
		const message = await response.json()
		alert(message.message)
		window.location.reload()
	}

	// console.log("cards in catalog: ", cards)
	return (
		<div>
			<div>
				{isAdmin && <>
					<button onClick={() => handleModalStatus(true, "editCreateModal")}>Add card</button>
					<button onClick={() => handleLogout()}>Logout</button>
				</>}
				<label htmlFor="sortBy">Sort by:</label>
				<select value={sortBy} onChange={e => setSortBy(e.target.value)} name="sortBy" id="sortBy">
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
					cards.map((item) => (
						<CatalogCard key={item._id} cardInfo={item} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} isAdmin={isAdmin} />
					))
				) : (
					<div>No cards</div>
				)}
			</div>
		</div>
	);
};

export default Catalog;
