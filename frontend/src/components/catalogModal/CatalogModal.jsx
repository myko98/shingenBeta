import styles from './CatalogModal.module.css';

const CatalogModal = ({ handleModalStatus, selectedCard }) => {

	console.log(selectedCard);
	const { name, image, description, price, properties } = selectedCard

	const PROPERTIES = [["alchoholPercentage", "Alchohol Percentage"]
		, ["body", "Body"]
		, ["brewery", "Brewery"]
		, ["fermentationStyle", "Fermentation Style"]
		, ["inStock", "In stock"]
		, ["pairing", "Pairing"]
		, ["polish", "Polish"]
		, ["region", "Region"]
		, ["riceType", "Rice Type"]
		, ["sizes", "Sizes"]
		, ["style", "Style"]
		, ["taste", "Taste"]]

	return (
		<div className={styles.modalOverlay} onClick={() => handleModalStatus(false)}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={() => handleModalStatus(false)}>
					&times;
				</button>
				<img src={image} />
				<div className={styles.description}>
					<div className={styles.header}>
						<h2>{name}</h2>
						<h2>Price: {price}</h2>
						<h2>Product Details</h2>
						<p>{description}</p>
					</div>
					<div className={styles.properties}>
						{PROPERTIES.map((pair) =>
							<div key={pair[0]} className={styles.gridRow}>
								<p>{pair[1]}:</p>
								<p style={{ textAlign: "right" }}>{properties[pair[0]]}</p>
							</div>)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CatalogModal;