import Card from 'react-bootstrap/Card';
import styles from "./CatalogCard.module.css"
const CatalogCard = ({ cardInfo, setOpenModal, handleSelectedCard }) => {

	const { description, image_base64, name, properties, short_msg } = cardInfo
	const price = properties.Price

	const short_message = short_msg ? short_msg : "default short message making the text a bit longer so it fills more space"
	const handleOnClick = () => {
		setOpenModal("catalogModal")
		handleSelectedCard(cardInfo)
	}

	return (
		<Card className={styles.cardContainer} onClick={() => handleOnClick()}>
			<Card.Img variant="top" src={"data:image/jpeg;base64," + image_base64} className={styles.imageSize} />
			<Card.Body className={styles.cardBody}>
				<Card.Title className={styles.title}>
					<h4>{name}</h4>
				</Card.Title>
				<Card.Text className={styles.description}>
					{short_message}
					<br />
					Available Sizes: {properties.Sizes}
				</Card.Text>
			</Card.Body>
			<Card.Footer>
				<small className="text-muted">Price: {price}</small>
			</Card.Footer>
		</Card>
	);
};

export default CatalogCard;
