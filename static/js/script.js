document.addEventListener("DOMContentLoaded", () => {
	const modal = document.getElementById("myModal");
	const learnMoreModal = document.getElementById("learnMoreModal");
	const close = document.getElementsByClassName("close")[0];
	const editForm = document.getElementById("editForm");
	const learnMoreContent = document.getElementById("learnMoreContent");

	// Sidebar accordion
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}


	close.onclick = () => modal.style.display = "none";

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
		if (event.target == learnMoreModal) {
			learnMoreModal.style.display = "none";
		}
	}

	document.querySelectorAll('#deleteButton').forEach(button => {
		button.addEventListener('click', event => {
			const confirmDelete = confirm("Are you sure you want to delete?")
			if (confirmDelete) {
				const gridItem = event.target.closest('.grid-item');
				const sakeId = gridItem.getAttribute('data-id');
				fetch(`http://127.0.0.1:5000/sake/${sakeId}`, {
					method: 'DELETE'
				})
					.then(response => {
						console.log('Response:', response);
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(data => {
						console.log('Delete response:', data);
						// Optionally remove the grid item from the DOM
						if (data.message === 'Sake deleted') {
							gridItem.remove();
							// Refresh the page to reflect changes in the database
							location.reload();
						}
					})
					.catch(error => {
						console.error('There was a problem with the fetch operation:', error);
					});
			}
		})
	})

	// Edit form handling, loads data from card into edit form
	document.querySelectorAll('.editButton').forEach(button => {
		button.addEventListener('click', event => {
			modal.style.display = "block";
			const contentContainer = event.target.closest('.content');
			if (!contentContainer) return;

			const title = contentContainer.querySelector('h2');
			const properties = contentContainer.querySelectorAll('p');

			if (title) editForm.name.value = title.textContent;

			// Get all values after colon and set values to editForm
			// properties.forEach(p => {
			// 	const text = p.textContent;
			// 	const [key, value] = text.split(': ');
			// 	if (key.toLowerCase() in editForm) {
			// 		editForm[key.toLowerCase()].value = value;
			// 	}
			// });

			properties.forEach(p => {
				const text = p.textContent;
				const [key, value] = text.split(': ');
				const inputElement = editForm.querySelector(`[name="${key.toLowerCase()}"]`);
				if (inputElement) {
					console.log(inputElement);
					if (inputElement.type === 'number') {
						console.log(`Setting ${key} to ${parseFloat(value)}`);
						inputElement.value = parseFloat(value) || 0; // Use parseFloat to convert to number
					} else {
						inputElement.value = value;
					}
				}
			});


			// Set the sakeId
			const gridItem = event.target.closest('.grid-item');
			const sakeId = gridItem.getAttribute('data-id');
			editForm.sakeId.value = sakeId;
		})
	})

	// Handle edit form submit
	editForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		console.log(editForm);
		const formData = new FormData(editForm);
		const sakeId = formData.get('sakeId');


		// .get takes the `name` of the field input
		const data = {
			name: formData.get('name'),
			properties: {
				region: formData.get('region'),
				brewery: formData.get('brewery'),
				alchohol: formData.get('alchohol %'),
				sizes: formData.get('sizes'),
				taste: formData.get('taste'),
				pairing: formData.get('pairing'),
				style: formData.get('style'),
				price: formData.get('price')
			},
			description: formData.get('description')
		};

		try {
			const response = await fetch(`http://127.0.0.1:5000/sake/${sakeId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			console.log('Update response:', result);

			// Optionally reload the page to reflect changes
			// location.reload();
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	})

	const learnMoreClose = document.getElementsByClassName("close")[1];
	learnMoreClose.onclick = () => learnMoreModal.style.display = "none";

	// Handle clicking Learn More button for each grid-item
	document.querySelectorAll('.learnMore').forEach(button => {
		button.addEventListener('click', event => {
			learnMoreModal.style.display = "block";

			const contentContainer = event.target.closest('.grid-item');
			const description = contentContainer.querySelector('.description').textContent.split(': ')[1];

			console.log(description);

			if (!contentContainer) return;

			const title = contentContainer.querySelector('h2').textContent;
			const properties = contentContainer.querySelectorAll('p');
			const image = contentContainer.querySelector('img').src;
			console.log("properties: ", properties)
			console.log(event.target.closest('img'))

			if (title) document.getElementById("learnMoreTitle").textContent = title;
			document.getElementById("learnMoreImage").src = image;

			properties.forEach(p => {
				const [key, value] = p.textContent.split(': ');
				const elementId = `learnMore${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}`;
				const element = document.getElementById(elementId);
				if (element) {
					element.textContent = `${key}: ${value.trim()}`;
				}
			});

			document.getElementById('learnMoreDescription').textContent = `Description: ${description}`;
		})
	})

	// Region Filter Functionality
	// Filter functionality
	document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
		checkbox.addEventListener('change', () => {
			// console.log(checkbox)
			filterSakes();
		});
	});

	function filterSakes() {
		const selectedRegions = Array.from(document.querySelectorAll('input[type="checkbox"][name="region"]:checked'))
			.map(checkbox => checkbox.value);

		const selectedBreweries = Array.from(document.querySelectorAll('input[type="checkbox"][name="brewery"]:checked'))
			.map(checkbox => checkbox.value);

		const selectedAlchohol = Array.from(document.querySelectorAll('input[type="checkbox"][name="alchohol"]:checked'))
			.map(checkbox => checkbox.value);

		console.log(selectedRegions, selectedBreweries, selectedAlchohol);

		document.querySelectorAll('.grid-item').forEach(item => {
			const itemRegion = item.getAttribute('data-region');
			const itemBrewery = item.getAttribute('data-brewery');
			const itemAlchohol = item.getAttribute('data-alchohol');

			const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(itemRegion);
			const breweryMatch = selectedBreweries.length === 0 || selectedBreweries.includes(itemBrewery);
			const alchoholMatch = selectedAlchohol.length === 0 || selectedAlchohol.every(val => Number(itemAlchohol) > val)

			if (regionMatch && breweryMatch && alchoholMatch) {
				item.style.display = 'flex';
			} else {
				item.style.display = 'none';
			}
		});
	}

	// LOGOUT
	document.getElementById('logout').addEventListener('click', () => {
		fetch('/logout', { method: "GET" }).then(response => {
			if (response.ok) {
				window.location.href = '/login'
			} else {
				console.log("logout failed")
			}
		}).catch(error => console.error("Error: ", error));
	})
})