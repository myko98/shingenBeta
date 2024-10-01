import Card from 'react-bootstrap/Card';
import styles from './CatalogCard.module.css';
const CatalogCard = ({ cardInfo, onClick }) => {
	const { description, image_base64, name, properties } = cardInfo;
	const price = properties.Price;

	return (
		<Card className={styles.cardContainer} onClick={onClick}>
			<Card.Img
				variant="top"
				src={'data:image/jpeg;base64,' + image_base64}
				className={styles.imageSize}
			/>
			<Card.Body className={styles.cardBody}>
				<Card.Title className={styles.title}>
					<h4>{name}</h4>
				</Card.Title>
				<Card.Text className={styles.description}>{description}</Card.Text>
			</Card.Body>
			<Card.Footer>
				<small className="text-muted">Price: {price}</small>
			</Card.Footer>
		</Card>
	);
};

export default CatalogCard;
