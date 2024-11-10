import styles from "./EditCreateModal.module.css"
import { useForm } from "react-hook-form"

const EditCreateModal = ({ setOpenModal, selectedCard }) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({ defaultValues: selectedCard || {} })

	console.log(selectedCard)

	const onSubmit = async (data) => {
		console.log("submitting data")
		console.log(data)
		const formData = new FormData()
		const properties = ["name", "shortMessage", "description", "region", "brewery", "sizes", "taste", "pairing", "style", "price", "alchohol", "riceType", "polish", "fermentationStyle", "body", "stock", "new", "expectedDate"]

		properties.forEach((prop) => formData.append(prop, data[prop]))

		if (data.image && data.image[0]) {
			formData.append("image", data.image[0])
		}

		const response = await fetch('http://127.0.0.1:5000/sake', {
			method: 'POST',
			body: formData
		})

		let result = await response.json()

		if (result.message) {
			alert(result.message)
		} else {
			alert(result.error)
		}
	}

	// console.log(watch(["name", "shortMessage"])) // watch input value by passing the name of it
	return (
		<div className={styles.modalOverlay} onClick={() => setOpenModal("")}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2>Sake Form</h2>
				<form id="editForm" onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">Name</label>
						<input type="text" className="form-control" name="name" id="name" {...register("name", { required: true })} value={selectedCard ? selectedCard.name : ""} />
					</div>

					<div className="mb-3">
						<label htmlFor="shortMsg" className="form-label">Short Message</label>
						<textarea
							maxLength="50"
							className="form-control"
							name="shortMessage"
							id="shortMessage"
							placeholder="Enter a short message here..."
							{...register("shortMessage")}
						></textarea>
					</div>

					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description</label>
						<textarea
							maxLength="230"
							className="form-control"
							name="description"
							id="description"
							placeholder="Enter text here..."
							{...register("description")}
						></textarea>
						<div id="count">0/230</div>
					</div>

					<div className="mb-3">
						<label htmlFor="region" className="form-label">Region/Prefecture</label>
						<input type="text" className="form-control" name="region" id="region" {...register("region")} />
					</div>

					<div className="mb-3">
						<label htmlFor="brewery" className="form-label">Brewery</label>
						<input type="text" className="form-control" name="brewery" id="brewery" {...register("brewery")} />
					</div>

					<div className="mb-3">
						<label htmlFor="sizes" className="form-label">Available Sizes</label>
						<input type="text" className="form-control" name="sizes" id="sizes" {...register("sizes")} />
					</div>

					<div className="mb-3">
						<label htmlFor="taste" className="form-label">Taste</label>
						<input type="text" className="form-control" name="taste" id="taste" {...register("taste")} />
					</div>

					<div className="mb-3">
						<label htmlFor="pairing" className="form-label">Pairing</label>
						<input type="text" className="form-control" name="pairing" id="pairing" {...register("pairing")} />
					</div>

					<div className="mb-3">
						<label htmlFor="style" className="form-label">Style</label>
						<input type="text" className="form-control" name="style" id="style" {...register("style")} />
					</div>

					<div className="mb-3">
						<label htmlFor="price" className="form-label">Price</label>
						<input type="number" className="form-control" name="price" id="price" {...register("price")} />
					</div>

					<div className="mb-3">
						<label htmlFor="alchohol" className="form-label">Alcohol %</label>
						<input
							type="number"
							className="form-control"
							name="alchohol"
							id="alchohol"
							{...register("alchohol")}
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="image" className="form-label">Photo</label>
						<input type="file" className="form-control" name="image" id="image" {...register("image", { required: true })} />
					</div>

					<div className="mb-3">
						<label htmlFor="riceType" className="form-label">Rice Type</label>
						<input
							type="text"
							className="form-control"
							name="rice type"
							id="riceType"
							{...register("riceType")}
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="polish" className="form-label">Polish</label>
						<input type="text" className="form-control" name="polish" id="polish" {...register("polish")} />
					</div>

					<div className="mb-3">
						<label htmlFor="fermentationStyle" className="form-label"
						>Fermentation Style</label
						>
						<input
							type="text"
							className="form-control"
							name="fermentation style"
							id="fermentationStyle"
							{...register("fermentationStyle")}
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="body" className="form-label">Body</label>
						<input type="text" className="form-control" name="body" id="body" {...register("body")} />
					</div>

					<div className="mb-3">
						<label className="form-label" htmlFor="inStock"> In stock </label>
						<input
							className="form-check-input"
							{...register("stock")}
							type="radio"
							value="inStock"
						/>
						<label className="form-label" htmlFor="notInStock"> Not in stock </label>
						<input
							className="form-check-input"
							{...register("stock")}
							type="radio"
							value="notInStock"
						/>
					</div>

					<div className="mb-3">
						<input
							className="form-check-input"
							type="checkbox"
							id="new"
							name="new"
							{...register("new")}
						/>
						<label className="form-label" htmlFor="new"> New </label>
					</div>

					<div className="mb-3 expectedDateContainer">
						<label htmlFor="expectedDate" className="form-label"
						>Expected date of return</label
						>
						<input
							id="expectedDate"
							name="expected date"
							className="form-control"
							type="date"
							{...register("expectedDate")}
						/>
					</div>

					<button type="submit" className="btn btn-primary">Submit</button>
				</form>
			</div>
		</div>
	)
}

export default EditCreateModal