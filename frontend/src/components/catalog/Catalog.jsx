import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards, handleModalStatus, handleSelectedCard, isAdmin }) => {
	
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
			{isAdmin && <>
				<button onClick={() => handleModalStatus(true, "editCreateModal")}>Add card</button>
				<button onClick={() => handleLogout()}>Logout</button>
			</>}
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
