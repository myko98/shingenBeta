import styles from './DetailsModal.module.css';

const DetailsModal = ({ modalCard, handleModalClose }) => {
	console.log(modalCard);
	const { name, description, properties, image_base64 } = modalCard;
	console.log('IMG_BASE64: ', image_base64);
	return (
		<div className={styles.modal} onClick={handleModalClose}>
			<div className={styles.modalBody}>
				<img src={'data:image/jpeg;base64,' + image_base64} alt={name} />
				<p>{name}</p>
				<p>{description}</p>
			</div>
		</div>
	);
};

export default DetailsModal;
