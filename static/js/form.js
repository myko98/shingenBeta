
document.addEventListener("DOMContentLoaded", () => {
	console.log("hi")

	// const backendUrl = 'https://shingenbeta.onrender.com';

	// TESTING USE 127
	const backendUrl = 'http://127.0.0.1:5000';
	const form = document.getElementById("sakeForm")


	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(form)
		const inStockCheckbox = document.getElementById('inStock');

		// Check if the checkbox is checked or not
		if (inStockCheckbox.checked) {
			formData.set('inStock', 'False'); // Set to 'False' if checked
		} else {
			formData.set('inStock', 'True');  // Set to 'True' if unchecked
		}

		for (let [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`)
		}

		fetch(`${backendUrl}/sake`, {
			method: 'POST',
			body: formData,
		}).then(response => response.json())
			.then(data => {
				if (data.message) {
					console.log(data.message)
					alert(data.message);
					// location.reload();
				} else if (data.error) {
					console.log("error: ", data.error)
					alert('Error: ' + data.error);
				}
			})
			.catch(error => console.error('Error:', error));

		// reset the expected date input
		document.getElementById("expectedDate").value = "";
	})

	// Unhide expected date option if item is not in stock
	document.getElementById("inStock").addEventListener("change", function () {
		const expectedDate = document.querySelector(".expectedDateContainer");
		console.log(expectedDate);
		if (this.checked) {
			expectedDate.style.display = "block";
		} else {
			expectedDate.style.display = "none";
		}
	})
})

// Limit text description count
document.querySelector("#description").addEventListener("input", function () {
	let charCount = this.value.length;
	const count = this.nextElementSibling;

	count.innerHTML = charCount + " / 230"

	if (charCount > 230) {
		this.value = this.value.substring(0, 230)
		count.innerHTML = "230 / 230"
	}
})