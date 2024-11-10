import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards, handleModalStatus, handleSelectedCard }) => {

	// console.log("cards in catalog: ", cards)
	return (
		<div>
			<button onClick={() => handleModalStatus(true, "editCreateModal")}>Add card</button>
			<div className={styles.catalogGrid}>
				{cards.length > 0 ? (
					cards.map((item) => (
						<CatalogCard key={item._id} cardInfo={item} handleModalStatus={handleModalStatus} handleSelectedCard={handleSelectedCard} />
					))
				) : (
					<div>No cards</div>
				)}
			</div>
		</div>
	);
};

export default Catalog;
