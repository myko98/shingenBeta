import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards, setOpenModal, handleSelectedCard }) => {

	// console.log("cards in catalog: ", cards)
	return (
		<div>
			<button onClick={() => setOpenModal("editCreateModal")}>Add card</button>
			<div className={styles.catalogGrid}>
				{cards.length > 0 ? (
					cards.map((item) => (
						<CatalogCard key={item._id} cardInfo={item} setOpenModal={setOpenModal} handleSelectedCard={handleSelectedCard} />
					))
				) : (
					<div>No cards</div>
				)}
			</div>
		</div>
	);
};

export default Catalog;
