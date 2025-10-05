import CatalogCard from '../catalogCard/CatalogCard';
import SortAndFilter from '../SortAndFilter/SortAndFilter';
import styles from './Catalog.module.css'; // Assuming you're using CSS Modules

const Catalog = ({
	cards,
	handleModalStatus,
	setSortBy,
	sortBy,
	filterByTaste,
	handleFilterByTaste,
	filterByPrice,
	handleFilterByPrice,
	filterByCategory,
	handleFilterByCategory,
}) => {
	const handleSortBy = (e) => {
		setSortBy(e.target.value);
		console.log(e.target.value);
	};
	return (
		<>
			<SortAndFilter
				styles={styles.sortBy}
				sortBy={sortBy}
				handleSortBy={handleSortBy}
				filterByTaste={filterByTaste}
				handleFilterByTaste={handleFilterByTaste}
				filterByPrice={filterByPrice}
				handleFilterByPrice={handleFilterByPrice}
				filterByCategory={filterByCategory}
				handleFilterByCategory={handleFilterByCategory}
			/>
			<div className={styles.catalogGrid}>
				{cards.length > 0 ? (
					cards.map((card) => (
						<CatalogCard
							key={card.id}
							cardInfo={card}
							handleModalStatus={handleModalStatus}
						/>
					))
				) : (
					<div>No cards</div>
				)}
			</div>
		</>
	);
};

export default Catalog;
