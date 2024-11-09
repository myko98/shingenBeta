import styles from "./EditCreateModal.module.css"

const EditCreateModal = ({ setOpenModal }) => {

	return (
		<div className={styles.modalOverlay} onClick={() => setOpenModal("")}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<span className="close">&times;</span>
				<h2>Sake Form</h2>
				<form id="editForm">
					<input type="hidden" name="sakeId" />
					<div className="mb-3">
						<label htmlFor="name" className="form-label">Name</label>
						<input type="text" className="form-control" name="name" id="name" />
					</div>

					<div className="mb-3">
						<label htmlFor="region" className="form-label">Region/Prefecture</label>
						<input type="text" className="form-control" name="region" id="region" />
					</div>

					<div className="mb-3">
						<label htmlFor="brewery" className="form-label">Brewery</label>
						<input type="text" className="form-control" name="brewery" id="brewery" />
					</div>

					<div className="mb-3">
						<label htmlFor="sizes" className="form-label">Available Sizes</label>
						<input type="text" className="form-control" name="sizes" id="sizes" />
					</div>

					<div className="mb-3">
						<label htmlFor="taste" className="form-label">Taste</label>
						<input type="text" className="form-control" name="taste" id="taste" />
					</div>

					<div className="mb-3">
						<label htmlFor="pairing" className="form-label">Pairing</label>
						<input type="text" className="form-control" name="pairing" id="pairing" />
					</div>

					<div className="mb-3">
						<label htmlFor="style" className="form-label">Style</label>
						<input type="text" className="form-control" name="style" id="style" />
					</div>

					<div className="mb-3">
						<label htmlFor="price" className="form-label">Price</label>
						<input type="number" className="form-control" name="price" id="price" />
					</div>

					<div className="mb-3">
						<label htmlFor="alchohol" className="form-label">Alcohol %</label>
						<input
							type="number"
							className="form-control"
							name="alchohol"
							id="alchohol"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="image" className="form-label">Photo</label>
						<input type="file" className="form-control" name="image" id="image" />
					</div>

					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description</label>
						<textarea
							maxLength="230"
							className="form-control"
							name="description"
							id="description"
							placeholder="Enter text here..."
						></textarea>
						<div id="count">0/230</div>
					</div>

					<div className="mb-3">
						<label htmlFor="riceType" className="form-label">Rice Type</label>
						<input
							type="text"
							className="form-control"
							name="rice type"
							id="riceType"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="polish" className="form-label">Polish</label>
						<input type="text" className="form-control" name="polish" id="polish" />
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
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="body" className="form-label">Body</label>
						<input type="text" className="form-control" name="body" id="body" />
					</div>

					<div className="mb-3">
						<input
							className="form-check-input"
							type="hidden"
							value="True"
							name="inStock"
						/>
						<input
							className="form-check-input"
							type="checkbox"
							value="False"
							id="inStock"
							name="in stock"
						/>
						<label className="form-label" htmlFor="inStock"> Not in stock </label>
					</div>

					<div className="mb-3">
						<input
							className="form-check-input"
							type="checkbox"
							id="new"
							name="new"
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
						/>
					</div>

					<button type="submit" className="btn btn-primary">Submit</button>
				</form>
			</div>
		</div>
	)
}

export default EditCreateModal