import styles from './CatalogModal.module.css';

const CatalogModal = ({ handleModalStatus, selectedCard }) => {

	console.log(selectedCard);
	const { name, image, description, price, properties } = selectedCard

	

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
					</div>
					<p>{description}</p>
					<h2>More Details</h2>
					<div className={styles.properties}>
						{/* {propertiesArr.map(([key, value]) =>
							<div key={key} className={styles.gridRow}>
								<p>{key}:</p>
								<p style={{ textAlign: "right" }}>{value}</p>
							</div>
						)} */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CatalogModal;