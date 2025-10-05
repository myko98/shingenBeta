import styles from './SortAndFilter.module.css';

const SortAndFilterValues = {
	sortBy: [
		'featured',
		'price_low_high',
		'price_high_low',
		'new_arrivals',
		'a_z',
		'z_a',
	],
	filterByTaste: ['all', 'light_dry', 'light_sweet', 'rich_dry', 'rich_sweet'],
	filterByPrice: ['all', '10-29', '30-49', '50+'],
	filterByCategory: [
		'all',
		'daiginjo',
		'junmai-daiginjo',
		'ginjo',
		'junmai-ginjo',
		'junmai',
		'honjozo',
		'futsushu',
		'other',
	],
};

const SortAndFilter = ({
	sortBy,
	handleSortBy,
	filterByTaste,
	handleFilterByTaste,
	filterByPrice,
	handleFilterByPrice,
	filterByCategory,
	handleFilterByCategory,
}) => {
	const getValueAndHandler = (key) => {
		switch (key) {
			case 'sortBy':
				return { value: sortBy, handler: handleSortBy };
			case 'filterByTaste':
				return { value: filterByTaste, handler: handleFilterByTaste };
			case 'filterByPrice':
				return { value: filterByPrice, handler: handleFilterByPrice };
			case 'filterByCategory':
				return { value: filterByCategory, handler: handleFilterByCategory };
			default:
				return { value: '', handler: () => {} };
		}
	};

	return (
		<div className={styles.container}>
			{Object.entries(SortAndFilterValues).map(([key, values]) => {
				const { value, handler } = getValueAndHandler(key);
				return (
					<div key={key} className={styles.item}>
						<label htmlFor={key}>{key}:</label>
						<select value={value} name={key} id={key} onChange={handler}>
							{values.map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					</div>
				);
			})}
		</div>
	);
};

export default SortAndFilter;
