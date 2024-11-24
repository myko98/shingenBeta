import Card from 'react-bootstrap/Card';
import styles from "./CatalogCard.module.css"
const CatalogCard = ({ cardInfo, handleModalStatus, handleSelectedCard, isAdmin }) => {

	const { _id, description, image_base64, name, properties, shortMessage } = cardInfo
	const price = properties.Price


	const short_message = shortMessage ? shortMessage : "default short message making the text a bit longer so it fills more space"

	const handleDelete = async (e) => {
		e.stopPropagation()
		const token = localStorage.getItem("token")

		if (confirm(`Are you sure you want to delete ${name}?`) == true) {
			const response = await fetch(`http://127.0.0.1:5000/sake/${_id}`, {
				method: "DELETE",
				headers: {
					"Authorization": token,
					"Content-type": "application/json"
				}
			})
			const data = await response.json();
			console.log(data.message)
			if (data.message) {
				window.location.reload();  // This will trigger a full page reload
			} else {
				alert(data.error)
			}
			// window.location.reload();  // This will trigger a full page reload
		}
	}

	const handleEdit = (e) => {
		e.stopPropagation()
		handleModalStatus(true, "editCreateModal", cardInfo)
	}

	return (
		<Card className={styles.cardContainer} onClick={() => handleModalStatus(true, "catalogModal", cardInfo)}>
			<Card.Img variant="top" src={"data:image/jpeg;base64," + image_base64} className={styles.imageSize} />

			<Card.Title className={styles.title}>
				<h4>{name}</h4>
			</Card.Title>

			<Card.Body>
				<div className={styles.description}>
					<Card.Text>
						<div>
							Sizes: {properties.Sizes}
						</div>
						<div>
							{short_message}
						</div>
					</Card.Text>
				</div>
			</Card.Body>
			<Card.Footer className={styles.cardFooter}>
				<p >Price: {price}</p>
				{isAdmin &&
					<>
						<button onClick={(e) => handleEdit(e)}>Edit</button>
						<button onClick={(e) => handleDelete(e)}>Delete</button>
					</>
				}
			</Card.Footer>
		</Card >
	);
};

export default CatalogCard;
