import CatalogCard from '../catalogCard/CatalogCard';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({ cards }) => {

	console.log("cards in catalog: ", cards)
	return (
		<div className={styles.catalogGrid}>
			{cards.map((item) => (
				<CatalogCard key={item._id} cardInfo={item} />
			))}
		</div>
	);
}

export default Catalog;
