import styles from './CatalogModal.module.css';

const CatalogModal = ({ handleModalStatus, selectedCard }) => {

	const { description, image_base64, name, properties, shortMessage } = selectedCard
	console.log(selectedCard);

	const propertiesArr = Object.entries(properties)
	const short_message = shortMessage ? shortMessage : "default short msg"

	console.log(propertiesArr)

	return (
		<div className={styles.modalOverlay} onClick={() => handleModalStatus(false)}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={() => handleModalStatus(false)}>
					&times;
				</button>
				<img src={"data:image/jpeg;base64," + image_base64} />
				<div className={styles.description}>
					<div className={styles.header}>
						<h2>{name}	</h2>
						<h2>Price: {properties.Price} </h2>
					</div>
					<p>{description}</p>
					<h2>More Details</h2>
					<div className={styles.properties}>
						{propertiesArr.map(([key, value]) =>
							<div key={key} className={styles.gridRow}>
								<p>{key}:</p>
								<p style={{ textAlign: "right" }}>{value}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CatalogModal;