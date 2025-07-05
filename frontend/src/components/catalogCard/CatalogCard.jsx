import Card from 'react-bootstrap/Card';
import styles from "./CatalogCard.module.css"
const CatalogCard = ({ cardInfo, handleModalStatus, handleSelectedCard }) => {
	console.log(cardInfo)
	const { cardMessage, image, name, price, properties } = cardInfo
	return (
		<Card className={styles.cardContainer} onClick={() => handleModalStatus(true, "catalogModal", cardInfo)}>
			<Card.Img variant="top" src={image} className={styles.imageSize} />

			<Card.Title className={styles.title}>
				<p className={styles.brewery}>{properties.brewery}</p>
				<h4>{name}</h4>
			</Card.Title>

			<Card.Body className={styles.description}>
				<div>
					{cardMessage}
				</div>
			</Card.Body>
			<Card.Footer className={styles.cardFooter}>
				<p>${price}</p>
				<p>{properties.inStock ? "In stock" : "Not in stock"}</p>
			</Card.Footer>
		</Card >
	);
};

export default CatalogCard;
