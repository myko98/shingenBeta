import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards }) => {

	console.log("cards in catalog: ", cards)
	return (
		<div className={styles.catalogGrid}>
			{cards.length > 0 ? (
				cards.map((item) => (
					<CatalogCard key={item._id} cardInfo={item} />
				))
			) : (
				<div>No cards</div>
			)}
		</div>
	);
}

export default Catalog;
