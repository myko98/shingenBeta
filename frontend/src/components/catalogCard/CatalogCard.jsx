import Card from 'react-bootstrap/Card';
import styles from "./CatalogCard.module.css"
const CatalogCard = ({ cardInfo, handleModalStatus, handleSelectedCard }) => {

	const { _id, description, image_base64, name, properties, shortMessage } = cardInfo
	const price = properties.Price


	const short_message = shortMessage ? shortMessage : "default short message making the text a bit longer so it fills more space"

	const handleDelete = async (e) => {
		e.stopPropagation()
		if (confirm(`Are you sure you want to delete ${name}?`) == true) {
			await fetch(`http://127.0.0.1:5000/sake/${_id}`, {
				method: "DELETE"
			})
			window.location.reload();  // This will trigger a full page reload
		}
	}

	const handleEdit = (e) => {
		e.stopPropagation()
		handleModalStatus(true, "editCreateModal", cardInfo)
	}

	return (
		<Card className={styles.cardContainer} onClick={() => handleModalStatus(true, "catalogModal", cardInfo)}>
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
			<Card.Footer style={{ display: "flex" }}>
				<p className="text-muted">Price: {price}</p>
				<button onClick={(e) => handleEdit(e)}>Edit</button>
				<button onClick={(e) => handleDelete(e)}>Delete</button>
			</Card.Footer>
		</Card>
	);
};

export default CatalogCard;
