import Card from 'react-bootstrap/Card';
import styles from "./CatalogCard.module.css"
const CatalogCard = ({ cardInfo, handleModalStatus, handleSelectedCard }) => {
	const { cardMessage, image, name, price } = cardInfo
	return (
		<Card className={styles.cardContainer} onClick={() => handleModalStatus(true, "catalogModal", cardInfo)}>
			<Card.Img variant="top" src={image} className={styles.imageSize} />

			<Card.Title className={styles.title}>
				<h4>{name}</h4>
			</Card.Title>

			<Card.Body>
				<div className={styles.description}>
					<Card.Text>
						<div>
							{cardMessage}
						</div>
					</Card.Text>
				</div>
			</Card.Body>
			<Card.Footer className={styles.cardFooter}>
				<p >Price: {price}</p>
			</Card.Footer>
		</Card >
	);
};

export default CatalogCard;
